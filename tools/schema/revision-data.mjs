export default {
  definitions: {
    RevisionDataType: {
      type: "object",
      required: ["SHA1", "changes"],
      properties: {
        cacheFormatVersion: {
          type: "number",
          description:
            "The version of the cache format. If the version number found in " +
            "the cache is < this number the cache is not used.",
        },
        SHA1: {
          type: "string",
        },
        changes: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "changeType"],
            properties: {
              name: {
                type: "string",
              },
              changeType: {
                type: "string",
                enum: [
                  "added",
                  "copied",
                  "deleted",
                  "modified",
                  "renamed",
                  "type changed",
                  "unmerged",
                  "pairing broken",
                  "unknown",
                  "unmodified",
                  "untracked",
                  "ignored",
                ],
              },
              oldName: {
                type: "string",
              },
              checksum: {
                type: "string",
              },
              args: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              rulesFile: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};
