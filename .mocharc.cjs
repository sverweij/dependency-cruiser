// @ts-check
/** @type {Mocha} */
module.exports = {
  extension: ["js", "mjs", "cjs"],
  reporter: "dot",
  timeout: 4_000,
  spec: "test/**/*.spec.{js,mjs,cjs}",
};
