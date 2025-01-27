#!/bin/sh

./wait-for-it.sh back_end:8000 --timeout=60 -- echo "Back-end is up"

exec "$@"
