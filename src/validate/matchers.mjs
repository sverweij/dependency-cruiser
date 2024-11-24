/* eslint-disable security/detect-object-injection */
import { replaceGroupPlaceholders } from "#utl/regex-util.mjs";
import { intersects } from "#utl/array-util.mjs";

// by their nature some dependency types always occur alongside other
// dependency types - aliased, type-only, import, export will always
// occur paired with 'local', 'npm' or core. Hence we only include
// a subset of dependency types where we _care_ if they are duplicates
const DEPENDENCY_TYPE_DUPLICATES_THAT_MATTER = new Set([
  "core",
  "local",
  "localmodule",
  "npm",
  "npm-bundled",
  "npm-dev",
  "npm-no-pkg",
  "npm-optional",
  "npm-peer",
  "npm-unknown",
]);

export function propertyEquals(pRule, pDependency, pProperty) {
  // The properties can be booleans, so we can't use !pRule.to[pProperty]
  if (Object.hasOwn(pRule.to, pProperty)) {
    return pDependency[pProperty] === pRule.to[pProperty];
  }
  return true;
}

export function propertyMatches(pRule, pDependency, pRuleProperty, pProperty) {
  return Boolean(
    !pRule.to[pRuleProperty] ||
      (pDependency[pProperty] &&
        pDependency[pProperty].match(pRule.to[pRuleProperty])),
  );
}

export function propertyMatchesNot(
  pRule,
  pDependency,
  pRuleProperty,
  pProperty,
) {
  return Boolean(
    !pRule.to[pRuleProperty] ||
      (pDependency[pProperty] &&
        !pDependency[pProperty].match(pRule.to[pRuleProperty])),
  );
}

export function matchesFromPath(pRule, pModule) {
  return Boolean(!pRule.from.path || pModule.source.match(pRule.from.path));
}

export function matchesFromPathNot(pRule, pModule) {
  return Boolean(
    !pRule.from.pathNot || !pModule.source.match(pRule.from.pathNot),
  );
}

export function matchesModulePath(pRule, pModule) {
  return Boolean(!pRule.module.path || pModule.source.match(pRule.module.path));
}

export function matchesModulePathNot(pRule, pModule) {
  return Boolean(
    !pRule.module.pathNot || !pModule.source.match(pRule.module.pathNot),
  );
}

function _toPath(pRule, pString, pGroups = []) {
  return Boolean(
    !pRule.to.path ||
      pString.match(replaceGroupPlaceholders(pRule.to.path, pGroups)),
  );
}

export function matchesToPath(pRule, pDependency, pGroups) {
  return _toPath(pRule, pDependency.resolved, pGroups);
}

export function matchToModulePath(pRule, pModule, pGroups) {
  return _toPath(pRule, pModule.source, pGroups);
}

function _toPathNot(pRule, pString, pGroups = []) {
  return (
    !pRule.to.pathNot ||
    !pString.match(replaceGroupPlaceholders(pRule.to.pathNot, pGroups))
  );
}

export function matchesToPathNot(pRule, pDependency, pGroups) {
  return _toPathNot(pRule, pDependency.resolved, pGroups);
}

export function matchToModulePathNot(pRule, pModule, pGroups) {
  return _toPathNot(pRule, pModule.source, pGroups);
}

export function matchesToDependencyTypes(pRule, pDependency) {
  return Boolean(
    !pRule.to.dependencyTypes ||
      intersects(pDependency.dependencyTypes, pRule.to.dependencyTypes),
  );
}

export function matchesToDependencyTypesNot(pRule, pDependency) {
  return Boolean(
    !pRule.to.dependencyTypesNot ||
      !intersects(pDependency.dependencyTypes, pRule.to.dependencyTypesNot),
  );
}

export function matchesToVia(pRule, pDependency, pGroups) {
  let lReturnValue = true;
  if (pRule.to.via && pDependency.cycle) {
    if (pRule.to.via.path) {
      lReturnValue = pDependency.cycle.some(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.via.path, pGroups)),
      );
    }
    if (pRule.to.via.pathNot) {
      lReturnValue = !pDependency.cycle.every(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.via.pathNot, pGroups)),
      );
    }
    if (pRule.to.via.dependencyTypes) {
      lReturnValue &&= pDependency.cycle.some(({ dependencyTypes }) =>
        pRule.to.via.dependencyTypes.some((pRuleDependencyType) =>
          dependencyTypes.includes(pRuleDependencyType),
        ),
      );
    }
    if (pRule.to.via.dependencyTypesNot) {
      lReturnValue &&= !pDependency.cycle.every(({ dependencyTypes }) =>
        pRule.to.via.dependencyTypesNot.some((pRuleDependencyType) =>
          dependencyTypes.includes(pRuleDependencyType),
        ),
      );
    }
  }
  return lReturnValue;
}

export function matchesToViaOnly(pRule, pDependency, pGroups) {
  let lReturnValue = true;
  if (pRule.to.viaOnly && pDependency.cycle) {
    if (pRule.to.viaOnly.path) {
      lReturnValue = pDependency.cycle.every(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.viaOnly.path, pGroups)),
      );
    }
    if (pRule.to.viaOnly.pathNot) {
      lReturnValue = !pDependency.cycle.some(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.viaOnly.pathNot, pGroups)),
      );
    }
    if (pRule.to.viaOnly.dependencyTypes) {
      lReturnValue &&= pDependency.cycle.every(({ dependencyTypes }) =>
        pRule.to.viaOnly.dependencyTypes.some((pRuleDependencyType) =>
          dependencyTypes.includes(pRuleDependencyType),
        ),
      );
    }
    if (pRule.to.viaOnly.dependencyTypesNot) {
      lReturnValue &&= !pDependency.cycle.some(({ dependencyTypes }) =>
        pRule.to.viaOnly.dependencyTypesNot.some((pRuleDependencyType) =>
          dependencyTypes.includes(pRuleDependencyType),
        ),
      );
    }
  }
  return lReturnValue;
}

export function matchesToIsMoreUnstable(pRule, pModule, pDependency) {
  if (Object.hasOwn(pRule.to, "moreUnstable")) {
    return (
      (pRule.to.moreUnstable &&
        pModule.instability < pDependency.instability) ||
      (!pRule.to.moreUnstable && pModule.instability >= pDependency.instability)
    );
  }
  return true;
}

export function matchesMoreThanOneDependencyType(pRule, pDependency) {
  /**
   * this rule exists to weed out i.e. dependencies declared in both
   * dependencies and devDependencies. We, however, also use the dependencyTypes
   * to specify closer to the source what kind of dependency it is (aliased via
   * a subpath import => both 'aliased' and 'aliased-subpath-import').
   *
   * Moreover an alias per definition is also a regular dependency. So we also
   * need to exclude those.
   *
   * Something similar goes for dependencies that are imported as 'type-only' -
   * which are some sort of regular dependency as well. Hence the use of the
   * lNotReallyDuplicates set.
   */

  if (Object.hasOwn(pRule.to, "moreThanOneDependencyType")) {
    return (
      pRule.to.moreThanOneDependencyType ===
      pDependency.dependencyTypes.filter((pDependencyType) =>
        DEPENDENCY_TYPE_DUPLICATES_THAT_MATTER.has(pDependencyType),
      ).length >
        1
    );
  }
  return true;
}
