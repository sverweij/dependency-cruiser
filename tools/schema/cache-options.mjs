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
        compress: {
          type: "boolean",
          description:
            "Whether to compress the cache or not\n" +
            "Setting this to true will adds a few ms to the execution time, but\n" +
            "typically reduces the cache size by 80-90%.\n" +
            "\n" +
            "Defaults to false.",
          default: false,
        },
      },
    },
    ...cacheStrategyType.definitions,
  },
};
