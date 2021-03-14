#!/bin/sh
set -e

node ../../../bin/dependency-cruise.js . -c .dependency-cruiser-options-only.js -p -T dot | dot -T svg > before.svg
node ../../../bin/dependency-cruise.js . -c .dependency-cruiser-with-rules.js -p -T dot | dot -T svg > rules-applied.svg
