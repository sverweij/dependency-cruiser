export default {
  definitions: {
    OutputType: {
      oneOf: [
        {
          type: "string",
          enum: [
            "anon",
            "archi",
            "azure-devops",
            "baseline",
            "cdot",
            "csv",
            "d2",
            "ddot",
            "dot-webpage",
            "dot",
            "err-html",
            "err-long",
            "err",
            "fdot",
            "flat",
            "html",
            "json",
            "markdown",
            "mermaid",
            "metrics",
            "null",
            "teamcity",
            "text",
            "x-dot-webpage",
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
