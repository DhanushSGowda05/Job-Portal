#!/bin/sh
# Loads variables from Client/.env into the shell environment, then runs
# docker-compose. This lets docker-compose.yml use ${VITE_BACKEND_URL} etc.
# as build args without needing a separate root .env file.
#
# Usage:
#   ./docker-up.sh            -> docker-compose up --build
#   ./docker-up.sh down       -> docker-compose down
#   ./docker-up.sh <anything> -> passed straight to docker-compose

set -e

ENV_FILE="./Client/.env"

if [ -f "$ENV_FILE" ]; then
  # Export every KEY=VALUE line from Client/.env, ignoring comments/blank lines
  set -a
  . "$ENV_FILE"
  set +a
else
  echo "Warning: $ENV_FILE not found. Client build args may be empty."
fi

if [ "$#" -eq 0 ]; then
  docker-compose up --build
else
  docker-compose "$@"
fi