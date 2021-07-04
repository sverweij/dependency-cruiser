#!/usr/bin/env node

const wrapStreamInHtml = require("../src/cli/tools/wrap-stream-in-html");

wrapStreamInHtml(process.stdin, process.stdout);
