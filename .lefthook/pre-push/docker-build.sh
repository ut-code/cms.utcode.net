#!/usr/bin/env bash
# Build up to builder stage to verify dependencies and build process
# Note: This uses secrets.dev.yaml for local verification
# Production builds will use secrets.prod.yaml with actual SOPS_AGE_KEY

set -e

if [ ! -f secrets.dev.yaml ]; then
  echo "❌ secrets.dev.yaml not found. Cannot verify Docker build."
  exit 1
fi

# Check if SOPS_AGE_KEY is available
if [ -z "$SOPS_AGE_KEY" ]; then
  echo "⚠️  SOPS_AGE_KEY not set. Skipping Docker build verification."
  echo "💡 To enable Docker build checks, export SOPS_AGE_KEY in your shell."
  exit 0
fi

echo "🐳 Verifying Docker build..."
docker build --target builder \
  --build-arg SOPS_AGE_KEY="${SOPS_AGE_KEY}" \
  --build-arg SECRETS_FILE=secrets.dev.yaml \
  -t cms-utcode-build-check .

echo "✅ Docker build verification passed!"
