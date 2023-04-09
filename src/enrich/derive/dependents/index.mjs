import getDependents from "./get-dependents.mjs";

export default function addDependents(pModules) {
  return pModules.map((pModule) => ({
    ...pModule,
    dependents: getDependents(pModule, pModules),
  }));
}
