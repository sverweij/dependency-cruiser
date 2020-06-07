#!/bin/sh
set -e
ASSET_DIR=doc/assets

node bin/dependency-cruise.js -Tdot -v "$ASSET_DIR/theming/bare.config.js" src/main | dot -Tsvg > "$ASSET_DIR/theming/bare.svg"
node bin/dependency-cruise.js -Tdot -v "$ASSET_DIR/theming/base.config.js" src/main | dot -Tsvg > "$ASSET_DIR/theming/base.svg"
node bin/dependency-cruise.js -Tdot -v "$ASSET_DIR/theming/engineering.config.js" src/main | dot -Tsvg > "$ASSET_DIR/theming/engineering.svg"
node bin/dependency-cruise.js -Tdot -v "$ASSET_DIR/theming/vertical.config.js" src/main | dot -Tsvg > "$ASSET_DIR/theming/vertical.svg"

node bin/dependency-cruise.js -Tdot -v "$ASSET_DIR/filtering/focus.config.json" src | dot -Tsvg > "$ASSET_DIR/filtering/focus.svg"
node bin/dependency-cruise.js -Tdot -v "$ASSET_DIR/filtering/snazzy-focus.config.json" src | dot -Tsvg > "$ASSET_DIR/filtering/snazzy-focus.svg"