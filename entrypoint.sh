#!/bin/sh
set -e

# ============================================
# PeridotVault Entrypoint
# Fetches secrets from Infisical using INFISICAL_TOKEN,
# injects into environment, then executes the original command.
# ============================================

INFISICAL_API_URL="${INFISICAL_API_URL:-http://localhost:8080}"
INFISICAL_ENV="${INFISICAL_ENV:-local}"

if [ -n "${INFISICAL_TOKEN:-}" ] && [ -n "${INFISICAL_PROJECT_ID:-}" ]; then
  echo "[entrypoint] Fetching secrets from Infisical (env: ${INFISICAL_ENV})..."
  resp=$(curl -sf "${INFISICAL_API_URL}/api/v3/secrets/${INFISICAL_PROJECT_ID}?environment=${INFISICAL_ENV}&secretPath=/" \
    -H "Authorization: Bearer ${INFISICAL_TOKEN}" 2>/dev/null || true)

  if [ -n "$resp" ]; then
    echo "$resp" | python3 -c '
import sys, json
try:
    data = json.load(sys.stdin)
    secrets = data.get("secrets", [])
    for s in secrets:
        key = s.get("secretKey", "")
        val = s.get("secretValue", "")
        print(f"{key}={val}")
except Exception as e:
    print(f"# entrypoint error: {e}", file=sys.stderr)
' > /tmp/infisical.env 2>/dev/null

    if [ -s /tmp/infisical.env ]; then
      set -a
      . /tmp/infisical.env
      set +a
      echo "[entrypoint] Loaded $(wc -l < /tmp/infisical.env) secrets"
    fi
    rm -f /tmp/infisical.env
  else
    echo "[entrypoint] No secrets returned from Infisical"
  fi
else
  echo "[entrypoint] INFISICAL_TOKEN not set. Skipping secret fetch."
fi

exec "$@"
