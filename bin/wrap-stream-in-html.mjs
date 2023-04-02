#!/usr/bin/env node

import wrapStreamInHtml from "../src/cli/tools/wrap-stream-in-html.mjs";

wrapStreamInHtml(process.stdin, process.stdout);
