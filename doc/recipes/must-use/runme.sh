#!/bin/sh
set -e

node ../../../bin/dependency-cruiser.mjs . -c .dependency-cruiser-options-only.js -p -T dot | dot -T svg > before.svg
node ../../../bin/dependency-cruiser.mjs . -c .dependency-cruiser-with-rules.js -p -T dot | dot -T svg > rules-applied.svg
