#!/usr/bin/env bash
set -euo pipefail

SECRETS_FILE="${1:-secrets.dev.yaml}"

SOPS_AGE_KEY=$(cat .sops-age-key.txt)
docker build \
  --build-arg SOPS_AGE_KEY="$SOPS_AGE_KEY" \
  --build-arg SECRETS_FILE="$SECRETS_FILE" \
  .
