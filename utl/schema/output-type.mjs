export default {
  definitions: {
    OutputType: {
      type: "string",
      enum: [
        "json",
        "html",
        "dot",
        "ddot",
        "cdot",
        "archi",
        "csv",
        "err",
        "err-long",
        "err-html",
        "teamcity",
        "anon",
        "text",
      ],
    },
  },
};
