import tryImport from "semver-try-require";
import meta from "#meta.cjs";

const livescript = await tryImport(
  "livescript",
  meta.supportedTranspilers.livescript,
);

/* c8 ignore start */
export default {
  isAvailable: () => livescript !== false,

  transpile: (pSource) => livescript.compile(pSource),
};
/* c8 ignore stop */
