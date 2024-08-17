// @ts-check
/** @type {Mocha} */
module.exports = {
  extension: ["js", "mjs", "cjs"],
  reporter: "dot",
  timeout: 8000, // 8s for testing on windows - with the previous setting of 4s it regularly timed out on the "uses the 'dot' reporter section for the 'x-dot-webpage' output type" test in main.format
  spec: "test/**/*.spec.{js,mjs,cjs}",
};
