export default {
  definitions: {
    CacheStrategyType: {
      type: "string",
      description:
        "The strategy to use for caching.\n" +
        "- 'metadata': use git metadata to detect changes;\n" +
        "- 'content': use (a checksum of) the contents of files to detect changes.\n\n" +
        "'content' is useful if you're not using git or work on partial clones " +
        "(which is typical on CI's). Trade-of: the 'content' strategy is typically " +
        "slower.\n" +
        "\n" +
        "Defaults to 'metadata'.",
      enum: ["metadata", "content"],
    },
  },
};
