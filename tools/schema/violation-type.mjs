export default {
  definitions: {
    ViolationTypeType: {
      type: "string",
      enum: [
        "dependency",
        "module",
        "reachability",
        "cycle",
        "instability",
        "folder",
      ],
    },
  },
};
