/** @type import("../../../../types/dependency-cruiser").IConfiguration */
module.exports = {
  forbidden: [
    {
      name: "no-forbidden-fruit",
      severity: "error",
      from: {},
      to: { path: "forbidden-fruit" },
    },
  ],
};
