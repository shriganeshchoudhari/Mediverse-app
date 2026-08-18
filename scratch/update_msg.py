import re
import os

def read_msg():
    with open('docs/MSG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_msg()

    # Split into introductory banner + 70 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in MSG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 70)")

    # 1. Enrich Chapter 18 (PostgreSQL Maintenance & pgvector Re-Indexing)
    chapter_map[18] = r"""
### Chapter 18: PostgreSQL Minor Upgrades, Maintenance & pgvector Optimization

**Maintenance & Operational Standard:**
* Execute automated table vacuuming and index maintenance during weekly off-peak windows (Sunday 02:00–04:00 UTC).
* Monitor pgvector 1536-D vector index bloat and query latency on `aitutor.embeddings_metadata`.

**Detailed Technical Execution & Runbook:**
* **pgvector HNSW Re-Indexing Command:**
  ```sql
  -- Concurrent re-indexing to prevent vector search lockups
  REINDEX INDEX CONCURRENTLY aitutor.idx_embeddings_hnsw;
  VACUUM (ANALYZE, VERBOSE) aitutor.embeddings_metadata;
  ```
* **Flyway Migration Lock Clearance SOP:**
  In the event of a pod termination during a schema migration, clear the stalled migration lock:
  ```sql
  DELETE FROM "flyway_schema_history" WHERE success = false;
  ```
* **PostgreSQL Upgrade Procedure:**
  Apply minor version patches using RDS zero-downtime Multi-AZ rolling upgrades (`aws rds modify-db-instance --auto-minor-version-upgrade`).
"""

    # 2. Enrich Chapter 19 (Redis Cluster Eviction & Cache Management)
    chapter_map[19] = r"""
### Chapter 19: Redis Cluster Upgrades, Memory Eviction & Cache Management

**Maintenance & Operational Standard:**
* Maintain Redis cluster memory utilization below $75\%$ to prevent eviction storms.
* Configure `maxmemory-policy allkeys-lru` across all Redis cluster shards.

**Detailed Technical Execution & Runbook:**
* **Memory Pressure Diagnostic:**
  ```bash
  # Check memory fragmentation ratio and key counts
  redis-cli -h redis.mediverse.internal info memory
  ```
* **Institutional Rate Limit Emergency Reset:**
  If an institutional IP range is erroneously blocked due to a network glitch, reset the token bucket:
  ```bash
  redis-cli -h redis.mediverse.internal --scan --pattern "rate_limit:ip:10.14.*" | xargs -r redis-cli -h redis.mediverse.internal del
  ```
* **Simulation Catalog Cache Warm-Up:**
  Trigger automated cache population for simulation presets and 3D organ metadata on application startup.
"""

    # 3. Enrich Chapter 32 (3D WebGL Context Loss Recovery & Client VRAM Disposal)
    chapter_map[32] = r"""
### Chapter 32: 3D WebGL Context Loss Recovery & Client VRAM Optimization

**Maintenance & Operational Standard:**
* Ensure robust error recovery for student hardware experiencing WebGL context loss or VRAM exhaustion during 3D organ dissection.

**Detailed Technical Execution & Runbook:**
* **WebGL Context Loss Handler (`ThreeCanvas.tsx`):**
  The canvas listens for `webglcontextlost` events, prevents browser default crashes (`event.preventDefault()`), and restores geometry buffers upon `webglcontextrestored`.
* **Client Model Cache Flushing:**
  If a student reports corrupt 3D organ models, provide the browser console flush command:
  ```javascript
  window.indexedDB.deleteDatabase('mediverse_3d_cache');
  window.location.reload();
  ```
* **GPU Memory Disposal Validation:**
  Ensure all three.js mesh instances bind to `useThreeMemoryCleanup.ts` to call `.dispose()` on geometries, materials, and textures upon route transitions.
"""

    # 4. Enrich Chapter 35 (Socratic AI Streaming & LLM Outage SOP)
    chapter_map[35] = r"""
### Chapter 35: Socratic AI SSE Stream Diagnostics, Key Rotation & LLM Outages

**Maintenance & Operational Standard:**
* Maintain $> 99.9\%$ availability for Socratic AI tutoring streams (`/api/v1/ai-tutor/chat/stream`).

**Detailed Technical Execution & Runbook:**
* **SSE Token Stream Diagnostics:**
  Verify Nginx reverse proxy buffering is disabled (`proxy_buffering off;`) and check for connection dropouts:
  ```bash
  curl -N -H "Accept: text/event-stream" -H "Authorization: Bearer ${TEST_JWT}" \
    -X POST https://api.mediverse.edu/api/v1/ai-tutor/chat/stream \
    -d '{"message":"Explain Frank-Starling Law","topicContext":"cardiovascular"}'
  ```
* **LLM HTTP 429 Rate Limiting Backoff:**
  `AITutorService.java` automatically implements exponential backoff with full jitter (initial backoff: $500\text{ms}$, max retries: 3) upon receiving upstream rate limits.
* **API Key Zero-Downtime Rotation:**
  Rotate OpenAI/Gemini API keys via AWS Secrets Manager; Spring Cloud Vault automatically refreshes runtime credentials without container restarts.
"""

    # 5. Enrich Chapter 45 (IMS Global LTI 1.3 JWKS Rotation & AGS Passback)
    chapter_map[45] = r"""
### Chapter 45: IMS Global LTI 1.3 Advantage JWKS Rotation & Grade Passback Troubleshooting

**Maintenance & Operational Standard:**
* Ensure seamless LMS interoperability (Canvas, Blackboard, Moodle) and automated Assignment and Grade Services (AGS) synchronization.

**Detailed Technical Execution & Runbook:**
* **RS256 JWKS Key Pair Rotation:**
  1. Generate new 2048-bit RSA key pair in AWS KMS.
  2. Publish public key to `/.well-known/jwks.json` alongside the existing key for a 48-hour dual-key transition window.
  3. Decommission old private key after all active LMS session tokens expire.
* **AGS Grade Passback Retry Queue:**
  Inspect failed grade passbacks in the database and trigger automated re-synchronization:
  ```sql
  -- Replay failed grade passbacks
  UPDATE lti.grade_passbacks 
  SET status = 'PENDING', retry_count = retry_count + 1 
  WHERE status = 'FAILED' AND created_at > now() - interval '24 hours';
  ```
"""

    # 6. Enrich Chapter 60 (Disaster Recovery Failover & Data Restoration)
    chapter_map[60] = r"""
### Chapter 60: Disaster Recovery Failover & Zero-Downtime Data Restoration

**Maintenance & Operational Standard:**
* Guarantee **RPO $\le 5\text{ minutes}$** and **RTO $\le 30\text{ minutes}$** during catastrophic cloud zone or database outages.

**Detailed Technical Execution & Runbook:**
* **Amazon RDS Multi-AZ Automated Failover:**
  ```bash
  # Force Multi-AZ failover in primary region ap-south-1
  aws rds reboot-db-instance --db-instance-identifier mediverse-prod-db --force-failover
  ```
* **Point-In-Time Recovery (PITR) Execution:**
  ```bash
  # Restore database cluster to target timestamp within 5-minute RPO
  aws rds restore-db-instance-to-point-in-time \
    --source-db-instance-identifier mediverse-prod-db \
    --target-db-instance mediverse-prod-db-restored \
    --restore-time "2026-08-18T12:00:00Z"
  ```
* **Route53 DNS Traffic Swing:**
  Update Route53 weighted routing policy to direct 100% of global user traffic to the warm standby disaster recovery region (`eu-central-1`).
"""

    # Reassemble complete MSG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_msg = "\n\n---\n\n".join(output_parts)
    print(f"Final MSG.md length: {len(final_msg)} characters across 70 chapters.")

    with open('docs/MSG.md', 'w', encoding='utf-8') as f:
        f.write(final_msg)
    print("Successfully updated docs/MSG.md with all Day-2 maintenance runbooks!")

if __name__ == '__main__':
    main()
