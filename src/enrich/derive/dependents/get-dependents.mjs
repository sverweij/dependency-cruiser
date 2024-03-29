import { isDependent } from "../module-utl.mjs";

export default function getDependents(pModule, pModules) {
  // perf between O(n) in an unconnected graph and O(n^2) in a fully connected one
  return pModules
    .filter(isDependent(pModule.source))
    .map((pDependentModule) => pDependentModule.source);
}
