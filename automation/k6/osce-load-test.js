/**
 * k6 Load Test — OSCE Exam Engine
 *
 * Scenario: Simulate concurrent students taking OSCE timed exam stations.
 * Tests: Session creation, station navigation, answer submission, timer accuracy.
 *
 * Run locally:
 *   k6 run automation/k6/osce-load-test.js
 *
 * Run with thresholds + HTML report:
 *   k6 run --out json=automation/k6/reports/osce-$(date +%Y%m%d).json automation/k6/osce-load-test.js
 *
 * Target SLAs:
 *   - P95 response time < 2000ms
 *   - P99 response time < 4000ms
 *   - Error rate < 1%
 *   - OSCE timer accuracy: session duration within ±2 seconds
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend, Gauge } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// ── Custom Metrics ──────────────────────────────────────────────────────────
const osceSessions       = new Counter('osce_sessions_created');
const osceErrors         = new Counter('osce_errors');
const osceSessionTime    = new Trend('osce_session_duration_ms', true);
const timerDriftGauge    = new Gauge('osce_timer_drift_ms');
const submitSuccessRate  = new Rate('osce_submit_success_rate');

// ── Test Configuration ──────────────────────────────────────────────────────
const BASE_URL  = __ENV.BASE_URL  || 'http://localhost:8085';
const API_URL   = `${BASE_URL}/api`;
const TEST_EMAIL = __ENV.TEST_EMAIL    || 'test.student@mediverse.qa';
const TEST_PASS  = __ENV.TEST_PASSWORD || 'QaStudent@2026!';

export const options = {
  scenarios: {
    // Ramp up to 50 concurrent OSCE students over 2 minutes
    osce_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m',  target: 10  },  // warm up
        { duration: '2m',  target: 50  },  // ramp to peak
        { duration: '3m',  target: 50  },  // sustain peak (50 concurrent OSCE sessions)
        { duration: '1m',  target: 100 },  // stress spike
        { duration: '2m',  target: 50  },  // return to baseline
        { duration: '1m',  target: 0   },  // ramp down
      ],
    },
    // Constant rate: simulate continuous exam submissions
    osce_constant: {
      executor: 'constant-arrival-rate',
      rate: 20,          // 20 exam submissions per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 40,
      maxVUs: 100,
    },
  },

  thresholds: {
    // Global HTTP thresholds
    http_req_duration: [
      'p(95)<2000',   // 95th percentile under 2 seconds
      'p(99)<4000',   // 99th percentile under 4 seconds
    ],
    http_req_failed:        ['rate<0.01'],    // < 1% HTTP errors
    http_reqs:              ['rate>10'],      // > 10 req/s throughput

    // OSCE-specific thresholds
    osce_submit_success_rate: ['rate>0.99'],  // 99% of submissions succeed
    osce_session_duration_ms: ['p(95)<3000'], // session creation P95 < 3s
    osce_timer_drift_ms:      ['avg<2000'],   // timer drift avg < 2 seconds
  },
};

// ── Shared authentication token (fetched once per VU) ──────────────────────
let authToken = null;

export function setup() {
  // Authenticate once and share token across VUs
  const loginRes = http.post(
    `${API_URL}/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  const ok = check(loginRes, { 'setup: login 200': (r) => r.status === 200 });
  if (!ok) {
    console.error('Setup login failed:', loginRes.status, loginRes.body);
    return { token: null };
  }
  const body = loginRes.json();
  return { token: body.accessToken || body.token };
}

// ── Main test function ──────────────────────────────────────────────────────
export default function (data) {
  const token = data.token;
  if (!token) {
    osceErrors.add(1);
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Test-Execution-ID': `k6-${__VU}-${__ITER}`,
    'X-Test-Suite': 'osce-load-test',
  };

  // ── GROUP 1: OSCE Station Discovery ─────────────────────────────────────
  group('OSCE Station Discovery', () => {
    const stationsRes = http.get(`${API_URL}/osce/stations`, { headers });
    check(stationsRes, {
      'GET /osce/stations 200': (r) => r.status === 200,
      'stations list not empty': (r) => r.json('content')?.length > 0,
      'station has id + title': (r) => {
        const s = r.json('content')?.[0];
        return s && s.id && s.title;
      },
    });
    sleep(0.5);
  });

  // ── GROUP 2: Session Creation & Timer Start ──────────────────────────────
  group('OSCE Session Creation', () => {
    const sessionStart = Date.now();
    const sessionRes = http.post(
      `${API_URL}/osce/sessions`,
      JSON.stringify({ stationType: 'HISTORY_TAKING', durationMinutes: 10 }),
      { headers }
    );

    const sessionCreated = check(sessionRes, {
      'POST /osce/sessions 201': (r) => r.status === 201,
      'session has id': (r) => r.json('sessionId') !== undefined,
      'session has timerEndAt': (r) => r.json('timerEndAt') !== undefined,
      'session duration correct': (r) => {
        const duration = r.json('durationSeconds');
        return duration >= 595 && duration <= 605; // 10 min ± 5 seconds
      },
    });

    if (sessionCreated) {
      osceSessions.add(1);
      const elapsed = Date.now() - sessionStart;
      osceSessionTime.add(elapsed);

      // Verify timer accuracy
      const timerEndAt = new Date(sessionRes.json('timerEndAt')).getTime();
      const expectedEnd = sessionStart + 10 * 60 * 1000;
      const drift = Math.abs(timerEndAt - expectedEnd);
      timerDriftGauge.add(drift);
    }

    sleep(1);
  });

  // ── GROUP 3: Station Navigation ──────────────────────────────────────────
  group('OSCE Station Navigation', () => {
    const navRes = http.get(`${API_URL}/osce/stations?category=CLINICAL_EXAMINATION&page=0&size=10`, { headers });
    check(navRes, {
      'station list 200': (r) => r.status === 200,
      'pagination present': (r) => r.json('totalPages') !== undefined,
      'response < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(0.3);
  });

  // ── GROUP 4: Answer Submission ───────────────────────────────────────────
  group('OSCE Answer Submission', () => {
    // Get a sample session to submit to
    const sessionsRes = http.get(`${API_URL}/osce/sessions/active`, { headers });
    if (sessionsRes.status !== 200) { sleep(1); return; }

    const session = sessionsRes.json('content')?.[0];
    if (!session) { sleep(1); return; }

    const submitRes = http.post(
      `${API_URL}/osce/sessions/${session.sessionId}/submit`,
      JSON.stringify({
        answers: [
          { questionId: 'q1', answer: 'Auscultation reveals bilateral crackles' },
          { questionId: 'q2', answer: 'Diagnosis: Community-acquired pneumonia' },
        ],
        submittedAt: new Date().toISOString(),
      }),
      { headers }
    );

    const success = check(submitRes, {
      'submit 200 or 201': (r) => r.status === 200 || r.status === 201,
      'score present': (r) => r.json('score') !== undefined,
      'feedback present': (r) => r.json('feedback') !== undefined,
    });
    submitSuccessRate.add(success ? 1 : 0);
    if (!success) osceErrors.add(1);

    sleep(0.5);
  });

  sleep(1);
}

// ── Teardown + Report ────────────────────────────────────────────────────────
export function handleSummary(data) {
  return {
    'automation/k6/reports/osce-load-report.html': htmlReport(data),
    'automation/k6/reports/osce-load-summary.txt': textSummary(data, { indent: ' ', enableColors: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
