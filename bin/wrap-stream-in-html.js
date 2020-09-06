#!/usr/bin/env node

const wrapStreamInHtml = require("../src/cli/tools/wrap-stream-in-html");

wrapStreamInHtml(process.stdin)
  .then((pOutput) => process.stdout.write(pOutput))
  .catch((pError) => {
    process.stderr.write(`${pError}\n`);
  });
