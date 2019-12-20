const fs = require("fs");
const path = require("path");
const cruiseOptions = require("./configuration.schema.js");

fs.writeFileSync(
  path.join(__dirname, "configuration.schema.json"),
  JSON.stringify(cruiseOptions, null, "  "),
  "utf8"
);
