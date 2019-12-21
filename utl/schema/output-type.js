module.exports = {
  definitions: {
    OutputType: {
      type: "string",
      enum: [
        "json",
        "html",
        "dot",
        "ddot",
        "csv",
        "err",
        "err-long",
        "err-html",
        "teamcity",
        "anon"
      ]
    }
  }
};
