import { dirname } from "node:path";
import consolidateModules from "./consolidate-modules.mjs";
import consolidateModuleDependencies from "./consolidate-module-dependencies.mjs";

function squashDependencyToDirectory(pDependency) {
  return {
    ...pDependency,
    resolved: dirname(pDependency.resolved),
  };
}
function squashModuleToDirectory(pModule) {
  return {
    ...pModule,
    source: dirname(pModule.source),
    consolidated: true,
    dependencies: pModule.dependencies.map(squashDependencyToDirectory),
  };
}

export default function consolidateToFolder(pModules) {
  return consolidateModules(pModules.map(squashModuleToDirectory)).map(
    consolidateModuleDependencies
  );
}
