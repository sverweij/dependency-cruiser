module.exports = {
  definitions: {
    SeverityType: {
      type: "string",
      description:
        "How severe a violation of a rule is. The 'error' severity will make some " +
        "reporters return a non-zero exit code, so if you want e.g. a build to stop " +
        "when there's a rule violated: use that.",
      enum: ["error", "warn", "info", "ignore"]
    }
  }
};
