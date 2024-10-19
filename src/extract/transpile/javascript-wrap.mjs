import { createRequire } from "node:module";

export default {
  isAvailable: () => true,

  version: () => {
    const require = createRequire(import.meta.url);
    return `acorn@${require("acorn").version}`;
  },

  transpile: (pSource) => pSource,
};
