import cacheStrategyType from "./cache-strategy-type.mjs";

export default {
  definitions: {
    CacheOptionsType: {
      type: "object",
      additionalProperties: false,
      properties: {
        folder: {
          type: "string",
          description:
            "The folder to store the cache in. Defaults to " +
            "node_modules/.cache/dependency-cruiser",
        },
        strategy: { $ref: "#/definitions/CacheStrategyType" },
      },
    },
    ...cacheStrategyType.definitions,
  },
};
