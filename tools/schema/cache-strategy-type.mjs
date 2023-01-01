export default {
  definitions: {
    CacheStrategyType: {
      type: "string",
      description:
        "The strategy to use for caching. 'metadata': use git metadata to detect " +
        "changes; 'content': use (a checksum of) the contents of files to detect " +
        "changes. The last one is useful if you're not on git or work on partial " +
        "clones (which is typical on CI's). Trade-of: might be a bit slower, will " +
        "not detect changes on files that are entirely new. Defaults to 'metadata'.",
      enum: ["metadata", "content"],
    },
  },
};
