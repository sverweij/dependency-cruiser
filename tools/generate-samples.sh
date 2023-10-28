#!/bin/sh
set -e
ASSET_DIR=doc/assets

node bin/dependency-cruise.mjs -Tdot --no-progress --config "$ASSET_DIR/theming/bare.config.js" src/main | dot -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/theming/bare.svg"
node bin/dependency-cruise.mjs -Tdot --no-progress --config "$ASSET_DIR/theming/base.config.js" src/main | dot -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/theming/base.svg"
node bin/dependency-cruise.mjs -Tdot --no-progress --config "$ASSET_DIR/theming/engineering.config.js" src/main | dot -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/theming/engineering.svg"
node bin/dependency-cruise.mjs -Tdot --no-progress --config "$ASSET_DIR/theming/vertical.config.js" src/main | dot -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/theming/vertical.svg"

node bin/dependency-cruise.mjs -Tdot --no-progress --config "$ASSET_DIR/filtering/focus.config.json" src | dot -Tsvg > "$ASSET_DIR/filtering/focus.svg"
node bin/dependency-cruise.mjs -Tdot --no-progress --config "$ASSET_DIR/filtering/snazzy-focus.config.json" src | dot -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/filtering/snazzy-focus.svg"

node bin/dependency-cruise.mjs -Tflat --no-progress --include-only ^src src/report | fdp -Gsplines=ortho -Gdim=10 -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/flat-report-example.svg"
node bin/dependency-cruise.mjs -Tdot --no-progress --include-only ^src src/report | dot -Gsplines=ortho -Tsvg | npx svgo -i - -o - > "$ASSET_DIR/flat-report-counter-example.svg"

node bin/dependency-cruise.mjs -Td2 --no-progress --include-only ^src/cache/ --highlight metadata-strategy src/cache | d2 --layout elk --scale 1 - | npx svgo -i - -o - > "$ASSET_DIR/d2.svg"