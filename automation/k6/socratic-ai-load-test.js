/**
 * k6 Load Test — Socratic AI Tutor (RAG + pgvector)
 *
 * Scenario: Simulate concurrent medical students querying the AI tutor.
 * Tests: Question ask endpoint, streaming response, context retrieval, RAG latency.
 *
 * Run locally:
 *   k6 run automation/k6/socratic-ai-load-test.js
 *
 * Run with output:
 *   k6 run --out json=automation/k6/reports/ai-$(date +%Y%m%d).json automation/k6/socratic-ai-load-test.js
 *
 * Target SLAs:
 *   - AI ask P95 < 8000ms   (LLM inference is slower; adjusted SLA)
 *   - AI ask P99 < 15000ms
 *   - Error rate < 1%
 *   - Context retrieval (pgvector search) P95 < 500ms
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// ── Custom Metrics ──────────────────────────────────────────────────────────
const aiQueriesTotal     = new Counter('ai_queries_total');
const aiErrors           = new Counter('ai_query_errors');
const aiResponseTime     = new Trend('ai_response_time_ms', true);
const contextSearchTime  = new Trend('ai_context_search_ms', true);
const aiSuccessRate      = new Rate('ai_query_success_rate');
const hallucination      = new Rate('ai_response_has_citation');  // 0 = no citation (risk)

// ── Test Configuration ──────────────────────────────────────────────────────
const BASE_URL   = __ENV.BASE_URL   || 'http://localhost:8085';
const API_URL    = `${BASE_URL}/api`;
const TEST_EMAIL = __ENV.TEST_EMAIL    || 'test.student@mediverse.qa';
const TEST_PASS  = __ENV.TEST_PASSWORD || 'QaStudent@2026!';

// Medical MCQ questions per domain — realistic load simulation
const CLINICAL_QUESTIONS = [
  { domain: 'allopathic', question: 'What is the first-line treatment for community-acquired pneumonia in an outpatient adult patient?' },
  { domain: 'dental', question: 'Describe the pathophysiology of periodontal bone loss in aggressive periodontitis.' },
  { domain: 'ayush', question: 'Explain the Tridosha theory in Ayurveda and its clinical significance in diagnosis.' },
  { domain: 'pharmacy', question: 'What is the mechanism of action of beta-lactam antibiotics and key resistance mechanisms?' },
  { domain: 'nursing', question: 'List the steps of the nursing process and explain the assessment phase.' },
  { domain: 'physio', question: 'What are the clinical features and physiotherapy management of frozen shoulder?' },
  { domain: 'veterinary', question: 'Describe the clinical signs of parvoviral enteritis in dogs and treatment protocol.' },
  { domain: 'public_health', question: 'Explain the epidemiological triad and its application in disease control.' },
  { domain: 'allopathic', question: 'What are the indications for emergency cesarean section?' },
  { domain: 'dental', question: 'Explain the stepwise caries removal technique and its advantages.' },
];

export const options = {
  scenarios: {
    // Gradual ramp — AI tutor during study hours
    ai_study_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 5  },   // gentle warm up (LLM needs time)
        { duration: '2m', target: 20 },   // ramp to moderate load
        { duration: '3m', target: 20 },   // sustain — 20 concurrent students
        { duration: '2m', target: 40 },   // peak: evening study rush
        { duration: '2m', target: 20 },   // return to baseline
        { duration: '1m', target: 0  },   // ramp down
      ],
    },
    // Spike test — viral study session / exam season
    ai_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 30,
      maxVUs: 80,
      stages: [
        { duration: '30s', target: 1  },
        { duration: '30s', target: 10 },  // spike to 10 req/s
        { duration: '1m',  target: 10 },  // sustain spike
        { duration: '30s', target: 1  },  // back down
      ],
      startTime: '8m',   // starts after main load test
    },
  },

  thresholds: {
    // AI response times are longer due to LLM inference
    'http_req_duration{name:ai_ask}':        ['p(95)<8000', 'p(99)<15000'],
    'http_req_duration{name:context_search}': ['p(95)<500'],
    'http_req_duration{name:health}':         ['p(95)<200'],
    http_req_failed:                           ['rate<0.01'],

    // Business metrics
    ai_query_success_rate:    ['rate>0.99'],
    ai_response_has_citation: ['rate>0.95'],  // 95% of responses must have citations
    ai_response_time_ms:      ['p(95)<8000'],
    ai_context_search_ms:     ['p(95)<500'],
  },
};

export function setup() {
  const loginRes = http.post(
    `${API_URL}/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  const ok = check(loginRes, { 'setup: auth 200': (r) => r.status === 200 });
  if (!ok) return { token: null };
  const body = loginRes.json();
  return { token: body.accessToken || body.token };
}

export default function (data) {
  const token = data.token;
  if (!token) { aiErrors.add(1); return; }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Test-Execution-ID': `k6-ai-${__VU}-${__ITER}`,
    'X-Test-Suite': 'socratic-ai-load-test',
  };

  // Pick a random clinical question
  const q = CLINICAL_QUESTIONS[Math.floor(Math.random() * CLINICAL_QUESTIONS.length)];

  // ── GROUP 1: Health check ─────────────────────────────────────────────────
  group('Health Check', () => {
    const res = http.get(`${API_URL}/actuator/health`, {
      headers,
      tags: { name: 'health' },
    });
    check(res, {
      'health 200': (r) => r.status === 200,
      'status UP': (r) => r.json('status') === 'UP',
    });
    sleep(0.2);
  });

  // ── GROUP 2: Context Search (pgvector retrieval) ──────────────────────────
  group('RAG Context Retrieval', () => {
    const searchStart = Date.now();
    const searchRes = http.post(
      `${API_URL}/ai/context/search`,
      JSON.stringify({ query: q.question, domain: q.domain, topK: 5 }),
      { headers, tags: { name: 'context_search' } }
    );
    contextSearchTime.add(Date.now() - searchStart);

    check(searchRes, {
      'context search 200': (r) => r.status === 200,
      'has results': (r) => r.json('results')?.length > 0,
      'results have source': (r) => r.json('results')?.[0]?.source !== undefined,
    });
    sleep(0.3);
  });

  // ── GROUP 3: Socratic AI Ask ──────────────────────────────────────────────
  group('Socratic AI Ask', () => {
    const askStart = Date.now();
    const askRes = http.post(
      `${API_URL}/ai/socratic/ask`,
      JSON.stringify({
        question: q.question,
        domain: q.domain,
        mode: 'SOCRATIC',   // vs DIRECT
        studentLevel: 'MBBS_YEAR_3',
      }),
      {
        headers,
        tags: { name: 'ai_ask' },
        timeout: '20s',   // AI responses can take longer
      }
    );

    const elapsed = Date.now() - askStart;
    aiResponseTime.add(elapsed);
    aiQueriesTotal.add(1);

    const success = check(askRes, {
      'ai ask 200': (r) => r.status === 200,
      'answer not empty': (r) => r.json('answer')?.length > 50,
      'response < 10s': (r) => r.timings.duration < 10000,
      'has follow-up questions': (r) => r.json('followUpQuestions')?.length > 0,
    });

    // Citation check — guard against hallucination
    const hasCitation = askRes.status === 200 && askRes.json('citations')?.length > 0;
    hallucination.add(hasCitation ? 1 : 0);

    aiSuccessRate.add(success ? 1 : 0);
    if (!success) aiErrors.add(1);

    sleep(2);  // Realistic think time between AI queries
  });

  // ── GROUP 4: Conversation History ─────────────────────────────────────────
  group('Conversation History', () => {
    const histRes = http.get(`${API_URL}/ai/sessions/history?domain=${q.domain}&limit=10`, {
      headers,
      tags: { name: 'history' },
    });
    check(histRes, {
      'history 200': (r) => r.status === 200,
      'history is array': (r) => Array.isArray(r.json('sessions')),
    });
    sleep(0.3);
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'automation/k6/reports/socratic-ai-report.html': htmlReport(data),
    'automation/k6/reports/socratic-ai-summary.txt': textSummary(data, { indent: ' ', enableColors: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
