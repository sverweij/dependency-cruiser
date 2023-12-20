/* eslint-disable security/detect-object-injection */
import has from "lodash/has.js";
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

function propertyEquals(pRule, pDependency, pProperty) {
  // The properties can be booleans, so we can't use !pRule.to[pProperty]
  if (has(pRule.to, pProperty)) {
    return pDependency[pProperty] === pRule.to[pProperty];
  }
  return true;
}

function propertyMatches(pRule, pDependency, pRuleProperty, pProperty) {
  return Boolean(
    !pRule.to[pRuleProperty] ||
      (pDependency[pProperty] &&
        pDependency[pProperty].match(pRule.to[pRuleProperty])),
  );
}

function propertyMatchesNot(pRule, pDependency, pRuleProperty, pProperty) {
  return Boolean(
    !pRule.to[pRuleProperty] ||
      (pDependency[pProperty] &&
        !pDependency[pProperty].match(pRule.to[pRuleProperty])),
  );
}

function fromPath(pRule, pModule) {
  return Boolean(!pRule.from.path || pModule.source.match(pRule.from.path));
}

function fromPathNot(pRule, pModule) {
  return Boolean(
    !pRule.from.pathNot || !pModule.source.match(pRule.from.pathNot),
  );
}

function modulePath(pRule, pModule) {
  return Boolean(!pRule.module.path || pModule.source.match(pRule.module.path));
}

function modulePathNot(pRule, pModule) {
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

function toPath(pRule, pDependency, pGroups) {
  return _toPath(pRule, pDependency.resolved, pGroups);
}

function toModulePath(pRule, pModule, pGroups) {
  return _toPath(pRule, pModule.source, pGroups);
}

function _toPathNot(pRule, pString, pGroups = []) {
  return (
    !Boolean(pRule.to.pathNot) ||
    !pString.match(replaceGroupPlaceholders(pRule.to.pathNot, pGroups))
  );
}

function toPathNot(pRule, pDependency, pGroups) {
  return _toPathNot(pRule, pDependency.resolved, pGroups);
}

function toModulePathNot(pRule, pModule, pGroups) {
  return _toPathNot(pRule, pModule.source, pGroups);
}

function toDependencyTypes(pRule, pDependency) {
  return Boolean(
    !pRule.to.dependencyTypes ||
      intersects(pDependency.dependencyTypes, pRule.to.dependencyTypes),
  );
}

function toDependencyTypesNot(pRule, pDependency) {
  return Boolean(
    !pRule.to.dependencyTypesNot ||
      !intersects(pDependency.dependencyTypes, pRule.to.dependencyTypesNot),
  );
}

function toVia(pRule, pDependency, pGroups) {
  let lReturnValue = true;
  if (pRule.to.via && pDependency.cycle) {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (pRule.to.via.path) {
      lReturnValue = pDependency.cycle.some(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.via.path, pGroups)),
      );
    }
    // if (pRule.to.via.dependencyTypes) {
    //   lReturnValue &&= pDependency.cycle.every(({ dependencyTypes }) =>
    //     pRule.to.via.dependencyTypes.some((pDependencyType) =>
    //       dependencyTypes.includes(pDependencyType)
    //     )
    //   );
    // }
  }
  return lReturnValue;
}

function toViaOnly(pRule, pDependency, pGroups) {
  let lReturnValue = true;
  if (pRule.to.viaOnly && pDependency.cycle) {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (pRule.to.viaOnly.path) {
      lReturnValue = pDependency.cycle.every(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.viaOnly.path, pGroups)),
      );
    }
    // if (pRule.to.viaOnly.dependencyTypes) {
    //   lReturnValue &&= pDependency.cycle.every(({ dependencyTypes }) =>
    //     pRule.to.viaOnly.dependencyTypes.some((pDependencyType) =>
    //       dependencyTypes.includes(pDependencyType)
    //     )
    //   );
    // }
  }
  return lReturnValue;
}

function toViaNot(pRule, pDependency, pGroups) {
  let lReturnValue = true;
  if (pRule.to.viaNot && pDependency.cycle) {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (pRule.to.viaNot.path) {
      lReturnValue = !pDependency.cycle.some(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.viaNot.path, pGroups)),
      );
    }
    // if (pRule.to.viaNot.dependencyTypes) {
    //   lReturnValue &&= !pDependency.cycle.some(({ dependencyTypes }) =>
    //     pRule.to.viaNot.dependencyTypes.some((pDependencyType) =>
    //       dependencyTypes.includes(pDependencyType)
    //     )
    //   );
    // }
  }
  return lReturnValue;
}

function toViaSomeNot(pRule, pDependency, pGroups) {
  let lReturnValue = true;
  if (pRule.to.viaSomeNot && pDependency.cycle) {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (pRule.to.viaSomeNot.path) {
      lReturnValue = !pDependency.cycle.every(({ name }) =>
        name.match(replaceGroupPlaceholders(pRule.to.viaSomeNot.path, pGroups)),
      );
    }
    // if (pRule.to.viaSomeNot.dependencyTypes) {
    //   lReturnValue &&= !pDependency.cycle.every(({ dependencyTypes }) =>
    //     pRule.to.viaSomeNot.dependencyTypes.some((pDependencyType) =>
    //       dependencyTypes.includes(pDependencyType)
    //     )
    //   );
    // }
  }
  return lReturnValue;
}

function toIsMoreUnstable(pRule, pModule, pDependency) {
  if (has(pRule, "to.moreUnstable")) {
    return (
      (pRule.to.moreUnstable &&
        pModule.instability < pDependency.instability) ||
      (!pRule.to.moreUnstable && pModule.instability >= pDependency.instability)
    );
  }
  return true;
}

function matchesMoreThanOneDependencyType(pRule, pDependency) {
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

  if (has(pRule.to, "moreThanOneDependencyType")) {
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

export default {
  replaceGroupPlaceholders,
  propertyEquals,
  propertyMatches,
  propertyMatchesNot,
  fromPath,
  fromPathNot,
  toPath,
  toModulePath,
  modulePath,
  modulePathNot,
  toPathNot,
  toModulePathNot,
  toDependencyTypes,
  toDependencyTypesNot,
  toVia,
  toViaOnly,
  toViaNot,
  toViaSomeNot,
  toIsMoreUnstable,
  matchesMoreThanOneDependencyType,
};
