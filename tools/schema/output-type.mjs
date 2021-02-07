export default {
  definitions: {
    OutputType: {
      oneOf: [
        {
          type: "string",
          enum: [
            "json",
            "html",
            "dot",
            "ddot",
            "cdot",
            "archi",
            "fdot",
            "flat",
            "csv",
            "err",
            "err-long",
            "err-html",
            "teamcity",
            "anon",
            "text",
          ],
        },
        {
          type: "string",
          pattern: "^plugin:[^:]+$",
        },
      ],
    },
  },
};
