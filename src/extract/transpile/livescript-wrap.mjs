import meta from "../../meta.js";
import tryImport from "./try-import.cjs";

const livescript = await tryImport(
  "livescript",
  meta.supportedTranspilers.livescript
);

/* c8 ignore start */
export default {
  isAvailable: () => livescript !== false,

  transpile: (pSource) => livescript.compile(pSource),
};
/* c8 ignore stop */
