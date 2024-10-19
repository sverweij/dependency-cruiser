import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

const livescript = await tryImport(
  "livescript",
  meta.supportedTranspilers.livescript,
);

/* c8 ignore start */
export default {
  isAvailable: () => livescript !== false,

  version: () => `livescript@${livescript.VERSION}`,

  transpile: (pSource) => livescript.compile(pSource),
};
/* c8 ignore stop */
