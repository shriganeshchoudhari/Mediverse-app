#!/usr/bin/env bash
# =============================================================================
# Newman CLI Test Runner — Mediverse API Automation
# =============================================================================
# Usage:
#   ./run-newman.sh                     # Run all collections against QA env
#   ./run-newman.sh --env staging       # Run against staging env
#   ./run-newman.sh --suite health      # Run health-check folder only
#   ./run-newman.sh --bail              # Stop on first failure
# =============================================================================

set -euo pipefail

# ── Defaults ─────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POSTMAN_DIR="$(dirname "$SCRIPT_DIR")"
COLLECTIONS_DIR="$POSTMAN_DIR/collections"
ENVIRONMENTS_DIR="$POSTMAN_DIR/environments"
REPORTS_DIR="$POSTMAN_DIR/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

ENVIRONMENT="qa"
SUITE=""
BAIL_ON_FAILURE=false
TIMEOUT_REQUEST=30000    # 30 seconds per request
TIMEOUT_GLOBAL=600000    # 10 minutes total
DELAY_REQUEST=200        # 200ms between requests (rate-limit protection)

# ── Parse arguments ───────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)       ENVIRONMENT="$2";    shift 2 ;;
    --suite)     SUITE="$2";          shift 2 ;;
    --bail)      BAIL_ON_FAILURE=true; shift   ;;
    --help|-h)
      echo "Usage: $0 [--env qa|staging|prod] [--suite folder-name] [--bail]"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Resolve environment file ──────────────────────────────────────────────────
case "$ENVIRONMENT" in
  qa)      ENV_FILE="$ENVIRONMENTS_DIR/Mediverse_QA.postman_environment.json" ;;
  staging) ENV_FILE="$ENVIRONMENTS_DIR/Mediverse_Staging.postman_environment.json" ;;
  prod)    ENV_FILE="$ENVIRONMENTS_DIR/Mediverse_Prod.postman_environment.json" ;;
  *)       echo "Unknown environment: $ENVIRONMENT"; exit 1 ;;
esac

COLLECTION_FILE="$COLLECTIONS_DIR/Mediverse_API_Regression.postman_collection.json"

# ── Validate files exist ──────────────────────────────────────────────────────
if [[ ! -f "$COLLECTION_FILE" ]]; then
  echo "ERROR: Collection file not found: $COLLECTION_FILE"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: Environment file not found: $ENV_FILE"
  echo "Available environments:"
  ls "$ENVIRONMENTS_DIR/" 2>/dev/null || echo "(none found)"
  exit 1
fi

# ── Ensure Newman is installed ────────────────────────────────────────────────
if ! command -v newman &> /dev/null; then
  echo "Installing Newman and reporters..."
  npm install -g newman newman-reporter-htmlextra newman-reporter-allure
fi

# ── Prepare report directory ──────────────────────────────────────────────────
mkdir -p "$REPORTS_DIR/allure-results"
mkdir -p "$REPORTS_DIR/html"
mkdir -p "$REPORTS_DIR/junit"

# ── Build Newman command ──────────────────────────────────────────────────────
NEWMAN_ARGS=(
  run "$COLLECTION_FILE"
  --environment "$ENV_FILE"
  --timeout-request "$TIMEOUT_REQUEST"
  --timeout "$TIMEOUT_GLOBAL"
  --delay-request "$DELAY_REQUEST"
  --reporters "cli,htmlextra,junit,json"
  --reporter-htmlextra-export "$REPORTS_DIR/html/newman-report-${TIMESTAMP}.html"
  --reporter-htmlextra-title "Mediverse API Report — ${ENVIRONMENT} — ${TIMESTAMP}"
  --reporter-htmlextra-showMarkdownLinks
  --reporter-htmlextra-omitResponseBodies
  --reporter-junit-export "$REPORTS_DIR/junit/newman-junit-${TIMESTAMP}.xml"
  --reporter-json-export "$REPORTS_DIR/newman-${TIMESTAMP}.json"
)

# ── Apply optional folder filter ──────────────────────────────────────────────
if [[ -n "$SUITE" ]]; then
  NEWMAN_ARGS+=(--folder "$SUITE")
  echo "Running suite: $SUITE"
fi

# ── Apply bail flag ───────────────────────────────────────────────────────────
if [[ "$BAIL_ON_FAILURE" == "true" ]]; then
  NEWMAN_ARGS+=(--bail)
  echo "Bail on first failure: ENABLED"
fi

# ── Inject environment overrides from shell env vars ──────────────────────────
if [[ -n "${BASE_URL:-}" ]]; then
  NEWMAN_ARGS+=(--env-var "baseUrl=${BASE_URL}")
fi
if [[ -n "${TEST_TOKEN:-}" ]]; then
  NEWMAN_ARGS+=(--env-var "authToken=${TEST_TOKEN}")
fi

# ── Run ───────────────────────────────────────────────────────────────────────
echo "============================================================"
echo "  Mediverse API Test Run"
echo "  Environment : $ENVIRONMENT"
echo "  Collection  : $(basename "$COLLECTION_FILE")"
echo "  Timestamp   : $TIMESTAMP"
echo "============================================================"

newman "${NEWMAN_ARGS[@]}"
NEWMAN_EXIT=$?

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
if [[ $NEWMAN_EXIT -eq 0 ]]; then
  echo "  ✅ All API tests PASSED"
else
  echo "  ❌ API tests FAILED (exit code: $NEWMAN_EXIT)"
fi
echo "  Reports: $REPORTS_DIR"
echo "============================================================"

exit $NEWMAN_EXIT
