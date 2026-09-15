/**
 * k6 Load Test — Curriculum Tree & Content Blocks (PERF-01)
 *
 * Validates Tier 2 Service Level Objective (SLO):
 *   - Curriculum API P95 Response Latency <= 250ms
 *   - HTTP Success Rate >= 99.0%
 *   - Concurrency: Up to 500 Virtual Users (VUs)
 *
 * Run:
 *   k6 run automation/k6/curriculum-load-test.js
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const errorRate = new Rate("curriculum_error_rate");
const curriculumP95 = new Trend("curriculum_p95_duration_ms", true);

export const options = {
  stages: [
    { duration: "30s", target: 50 },   // Warm-up ramp
    { duration: "1m",  target: 200 },  // Moderate cohort load
    { duration: "2m",  target: 500 },  // Peak university concurrency
    { duration: "30s", target: 0 },    // Cool-down
  ],
  thresholds: {
    // SLO Enforcement: Tier 2 Curriculum P95 <= 250ms
    http_req_duration: ["p(95)<250", "p(99)<600"],
    curriculum_error_rate: ["rate<0.01"], // Less than 1% errors
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8085";

export default function () {
  const params = {
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": "default",
    },
    timeout: "5s",
  };

  group("Curriculum Domain & Tree Navigation", () => {
    // 1. Fetch domain catalog
    const domainsRes = http.get(`${BASE_URL}/api/v1/curriculum/domains`, params);
    const domainOk = check(domainsRes, {
      "domains status 200": (r) => r.status === 200,
    });
    errorRate.add(!domainOk);
    curriculumP95.add(domainsRes.timings.duration);

    sleep(1);

    // 2. Fetch full tree for Allopathic MBBS
    const treeRes = http.get(`${BASE_URL}/api/v1/curriculum/allopathic/tree`, params);
    const treeOk = check(treeRes, {
      "curriculum tree status 200 or 404": (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(!treeOk);
    curriculumP95.add(treeRes.timings.duration);

    sleep(1);

    // 3. Search curriculum index
    const searchRes = http.get(`${BASE_URL}/api/v1/curriculum/search?query=cardiac`, params);
    const searchOk = check(searchRes, {
      "search status 200 or 404": (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(!searchOk);
    curriculumP95.add(searchRes.timings.duration);
  });

  sleep(1);
}
