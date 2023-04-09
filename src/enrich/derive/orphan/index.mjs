import isOrphan from "./is-orphan.mjs";

export default function deriveOrphans(pModules) {
  return pModules.map((pModule) => ({
    ...pModule,
    orphan: isOrphan(pModule, pModules),
  }));
}
