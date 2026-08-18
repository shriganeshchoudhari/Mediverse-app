import re
import os

def read_or():
    with open('docs/OR.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_or()

    # Split into introductory banner + 75 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in OR.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 75)")

    # 1. Enrich Chapter 19 (Recovery: Rebuilding Corrupted pgvector Index)
    chapter_map[19] = r"""
### Chapter 19: Recovery: Rebuilding Corrupted pgvector Index & Slow Query Triage

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Socratic AI chat latency spikes $> 3.0\text{s}$ or throws `ERROR: hnsw index graph corrupted`.
* **Diagnostic Query:**
  ```sql
  EXPLAIN ANALYZE 
  SELECT document_source, chapter_title, chunk_text, (embedding <=> '[0.012, -0.045, ...]'::vector) AS distance
  FROM aitutor.embeddings_metadata 
  ORDER BY distance ASC LIMIT 5;
  ```
* **Tactical Rebuild Command:**
  ```sql
  -- Increase maintenance memory and rebuild HNSW graph concurrently
  SET maintenance_work_mem = '1GB';
  REINDEX INDEX CONCURRENTLY aitutor.idx_embeddings_hnsw;
  VACUUM (ANALYZE, VERBOSE) aitutor.embeddings_metadata;
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Check PostgreSQL log entries for deadlocks or out-of-memory errors during vector indexing.
* **Step 2 (Isolation & Circuit Breaking):** Temporarily fall back to keyword-based full-text search (`tsvector`) if vector queries lock.
* **Step 3 (Mitigation & Recovery):** Execute `REINDEX INDEX CONCURRENTLY` to restore the HNSW cosine graph without blocking read queries.
* **Step 4 (Post-Mitigation Verification):** Validate vector query latency returns to P95 $< 15\text{ms}$.
"""

    # 2. Enrich Chapter 25 (Triage: Spring Boot JVM Heap Exhaustion & HikariCP Leaks)
    chapter_map[25] = r"""
### Chapter 25: Triage: Spring Boot JVM Heap Exhaustion & HikariCP Leaks

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Spring Boot backend pod restarts with `OOMKilled` (Exit Code 137) or HTTP 500 `Connection is not available`.
* **Diagnostic Commands:**
  ```bash
  # Check HikariCP connection pool metrics
  curl -s http://localhost:8085/actuator/metrics/hikaricp.connections.pending
  curl -s http://localhost:8085/actuator/metrics/hikaricp.connections.active

  # Generate live thread dump to detect connection leaks
  kubectl exec -it <backend-pod-name> -n mediverse-prod -- jcmd 1 Thread.print > /tmp/thread_dump.txt
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Inspect HikariCP active vs. idle connection gauges in Grafana.
* **Step 2 (Isolation & Circuit Breaking):** Scale backend replica set from 3 to 6 pods to distribute incoming connection pressure.
* **Step 3 (Mitigation & Recovery):** Perform rolling pod restart to release leaked database handles (`kubectl rollout restart deployment/mediverse-backend -n mediverse-prod`).
* **Step 4 (Post-Mitigation Verification):** Confirm pending connection requests drop to 0.
"""

    # 3. Enrich Chapter 35 (Mitigation: Socratic AI SSE Stream Buffer Stalls & LLM 429)
    chapter_map[35] = r"""
### Chapter 35: Mitigation: Socratic AI SSE Stream Buffer Stalls & LLM 429 Outages

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Student Socratic AI drawer displays spinning loader without rendering streamed tokens.
* **Diagnostic Command:**
  ```bash
  # Verify backend produces unbuffered text/event-stream chunks
  curl -i -N -H "Accept: text/event-stream" \
    -H "Authorization: Bearer ${TEST_JWT}" \
    -X POST https://api.mediverse.edu/api/v1/ai-tutor/chat/stream \
    -d '{"message":"What is preload?","topicContext":"cardiovascular"}'
  ```
* **Verify Response Headers:** Ensure `X-Accel-Buffering: no` and `Content-Type: text/event-stream` are present.

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Inspect Nginx ingress logs for `upstream prematurely closed connection`.
* **Step 2 (Isolation & Circuit Breaking):** If upstream LLM returns HTTP 429, activate exponential backoff and route to secondary backup model.
* **Step 3 (Mitigation & Recovery):** Reload Nginx ingress if proxy buffering was erroneously re-enabled (`nginx -s reload`).
* **Step 4 (Post-Mitigation Verification):** Confirm first-token streaming latency drops below $800\text{ms}$.
"""

    # 4. Enrich Chapter 40 (Mitigation: 3D WebGL GLB CDN Cache Invalidation)
    chapter_map[40] = r"""
### Chapter 40: Mitigation: 3D WebGL Draco Mesh CDN Cache Invalidation

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Students receive 404 or corrupted binary errors loading 3D heart, lung, or kidney meshes.
* **Tactical Invalidation Command:**
  ```bash
  # Invalidate CloudFront CDN cache for all 3D GLB assets and textures
  aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
    --paths "/models/*" "/textures/*" "/draco/*"
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Verify S3 bucket asset checksums (`aws s3 ls s3://mediverse-assets-prod/models/`).
* **Step 2 (Isolation & Circuit Breaking):** Invalidate edge cache to flush stale or corrupted binary chunks.
* **Step 3 (Mitigation & Recovery):** Purge browser IndexedDB cache on affected client sessions.
* **Step 4 (Post-Mitigation Verification):** Test 3D organ load time in browser incognito window ($< 1.5\text{s}$).
"""

    # 5. Enrich Chapter 50 (Triage: IMS Global LTI 1.3 OIDC State Nonce & Clock Skew)
    chapter_map[50] = r"""
### Chapter 50: Triage: IMS Global LTI 1.3 OIDC State Nonce & Clock Skew Errors

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** University LMS users fail launch with `401 Unauthorized: Invalid Token Signature` or `State Nonce Expired`.
* **Diagnostic Command:**
  ```bash
  # Check university LMS JWKS public key endpoint reachability
  curl -v -m 5 https://canvas.university.edu/.well-known/jwks.json
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Inspect backend JWT validation logs for `JwtValidationException: token was issued in the future`.
* **Step 2 (Isolation & Circuit Breaking):** If clock skew is detected between AWS and university servers, apply a 60-second timestamp leeway in `Lti13SecurityConfig.java`.
* **Step 3 (Mitigation & Recovery):** Re-sync server NTP time daemon (`chronyd -q 'server pool.ntp.org iburst'`).
* **Step 4 (Post-Mitigation Verification):** Execute synthetic LTI 1.3 OIDC test launch from Canvas sandbox.
"""

    # 6. Enrich Chapter 65 (Recovery: Zero-Downtime Database Multi-AZ Emergency Failover)
    chapter_map[65] = r"""
### Chapter 65: Recovery: Zero-Downtime Database Multi-AZ Emergency Failover

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Amazon RDS Primary instance unresponsive or suffering unrecoverable storage degradation.
* **Tactical Failover Command:**
  ```bash
  # Force immediate Multi-AZ failover to standby replica in ap-south-1b
  aws rds reboot-db-instance \
    --db-instance-identifier mediverse-prod-db \
    --force-failover
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Check RDS CloudWatch `DatabaseConnections` and `ReadIOPS` spikes.
* **Step 2 (Isolation & Circuit Breaking):** Trigger automated Multi-AZ failover; DNS CNAME automatically updates within 60 seconds.
* **Step 3 (Mitigation & Recovery):** Monitor backend HikariCP connection recovery as pods re-establish JDBC pools to the new primary.
* **Step 4 (Post-Mitigation Verification):** Validate API health probes (`/actuator/health`) return HTTP 200 `UP`.
"""

    # Reassemble complete OR.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_or = "\n\n---\n\n".join(output_parts)
    print(f"Final OR.md length: {len(final_or)} characters across 75 chapters.")

    with open('docs/OR.md', 'w', encoding='utf-8') as f:
        f.write(final_or)
    print("Successfully updated docs/OR.md with all tactical SRE incident runbooks!")

if __name__ == '__main__':
    main()
