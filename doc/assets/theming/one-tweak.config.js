module.exports = {
  extends: "./base.config.js",
  options: {
    reporterOptions: {
      dot: {
        theme: {
          modules: [
            {
              criteria: { source: "normalize\\.js$" },
              attributes: {
                style: "filled",
                fillcolor: "dodgerblue",
                fontcolor: "white"
              }
            }
          ]
        }
      }
    }
  }
};
