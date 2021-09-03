import violations from "./violations.mjs";

export default {
  title: "dependency-cruiser baseline ('known errors') format",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/schema/baseline-violations.schema.json",
  $ref: "#/definitions/ViolationsType",
  definitions: {
    ...violations.definitions,
  },
};
