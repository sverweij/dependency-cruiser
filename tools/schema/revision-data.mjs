export default {
  definitions: {
    RevisionDataType: {
      type: "object",
      required: ["SHA1", "changes"],
      properties: {
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
