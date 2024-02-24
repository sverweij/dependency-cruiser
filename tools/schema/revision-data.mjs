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
            "the cache is < the version number in the code, the cache is " +
            "considered stale and won't be used (and overwritten on next run).",
        },
        SHA1: {
          type: "string",
        },
        changes: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "type"],
            properties: {
              name: {
                type: "string",
              },
              type: {
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
