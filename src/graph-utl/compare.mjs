/** @import { IViolation } from "../../types/dependency-cruiser.mjs" */
/* eslint-disable no-magic-numbers */
const SEVERITY2MUMBER = new Map([
  ["error", 1],
  ["warn", 2],
  ["info", 3],
  ["ignore", 4],
]);

function severity2number(pSeverity) {
  return SEVERITY2MUMBER.get(pSeverity) || -1;
}

export function compareSeverities(pFirstSeverity, pSecondSeverity) {
  return Math.sign(
    severity2number(pFirstSeverity) - severity2number(pSecondSeverity),
  );
}

/**
 * Compare two arrays of mini dependencies by their 'name' field.
 * Used to deterministically order violations that have the same severity/rule/from/to
 * but differ in their cycle or via paths.
 *
 * @param {Array<{name: string}>} pFirstArray - First array (or undefined)
 * @param {Array<{name: string}>} pSecondArray - Second array (or undefined)
 * @returns {number} - -1/0/1 following comparison semantics
 */
function compareArraysByName(pFirstArray, pSecondArray) {
  const lFirst = pFirstArray || [];
  const lSecond = pSecondArray || [];
  const lMinLength = Math.min(lFirst.length, lSecond.length);

  // eslint-disable-next-line unicorn/prevent-abbreviations, no-plusplus
  for (let i = 0; i < lMinLength; i++) {
    // eslint-disable-next-line security/detect-object-injection
    const lComparison = lFirst[i].name.localeCompare(lSecond[i].name);
    if (lComparison !== 0) {
      return lComparison;
    }
  }

  return Math.sign(lFirst.length - lSecond.length);
}

/**
 * Compare two arrays of strings.
 *
 * @param {Array<string>} pFirstArray - First array (or undefined)
 * @param {Array<string>} pSecondArray - Second array (or undefined)
 * @returns {number} - -1/0/1 following comparison semantics
 */
function compareArrays(pFirstArray, pSecondArray) {
  const lFirst = pFirstArray || [];
  const lSecond = pSecondArray || [];
  const lMinLength = Math.min(lFirst.length, lSecond.length);

  // eslint-disable-next-line unicorn/prevent-abbreviations, no-plusplus
  for (let i = 0; i < lMinLength; i++) {
    // eslint-disable-next-line security/detect-object-injection
    const lComparison = lFirst[i].localeCompare(lSecond[i]);
    if (lComparison !== 0) {
      return lComparison;
    }
  }

  return Math.sign(lFirst.length - lSecond.length);
}

/**
 *
 * @param {IViolation} pFirstViolation
 * @param {IViolation} pSecondViolation
 * @param {boolean} pCompareSeverities
 * @returns {number}
 */
// eslint-disable-next-line complexity
function compareViolationsBase(
  pFirstViolation,
  pSecondViolation,
  pCompareSeverities,
) {
  return (
    (pCompareSeverities &&
      compareSeverities(
        pFirstViolation.rule.severity,
        pSecondViolation.rule.severity,
      )) ||
    pFirstViolation.rule.name.localeCompare(pSecondViolation.rule.name) ||
    pFirstViolation.from.localeCompare(pSecondViolation.from) ||
    pFirstViolation.to.localeCompare(pSecondViolation.to) ||
    (pFirstViolation.unresolvedTo ?? "").localeCompare(
      pSecondViolation.unresolvedTo ?? "",
    ) ||
    (pFirstViolation.type ?? "").localeCompare(pSecondViolation.type ?? "") ||
    compareArrays(
      pFirstViolation.dependencyTypes,
      pSecondViolation.dependencyTypes,
    ) ||
    compareArraysByName(pFirstViolation.cycle, pSecondViolation.cycle) ||
    compareArraysByName(pFirstViolation.via, pSecondViolation.via)
  );
}

/**
 * Compares violations on all relevant fields _excluding_ severity
 *
 * @param {IViolation} pFirstViolation
 * @param {IViolation} pSecondViolation
 * @returns {number}
 */
export function compareViolationsExSeverities(
  pFirstViolation,
  pSecondViolation,
) {
  return compareViolationsBase(pFirstViolation, pSecondViolation, false);
}

/**
 * Compares violations on all relevant fields _including_ severity
 *
 * @param {IViolation} pFirstViolation
 * @param {IViolation} pSecondViolation
 * @returns {number}
 */
export function compareViolations(pFirstViolation, pSecondViolation) {
  return compareViolationsBase(pFirstViolation, pSecondViolation, true);
}

/**
 * Compare two arrays of violations and return a diff by value.
 *
 * Use the project’s established scalar ordering, compareViolations(),
 * rather than introducing a second comparison construct. This keeps the
 * semantics in one place and makes the diff logic easier to maintain.
 *
 * @param {IViolation[]} pFirstViolationArray - First array of violations
 * @param {IViolation[]} pSecondViolationArray - Second array of violations
 * @returns {{
 *   new: IViolation[]; // only in the second array
 *   same: IViolation[]; // in both arrays
 *   old: IViolation[]; // only in the first array
 * }}
 */
export function diffViolationArrays(
  pFirstViolationArray,
  pSecondViolationArray,
) {
  const lFirstViolations = pFirstViolationArray.toSorted(
    compareViolationsExSeverities,
  );
  const lSecondViolations = pSecondViolationArray.toSorted(
    compareViolationsExSeverities,
  );
  const lNew = [];
  const lSame = [];
  const lOld = [];
  let lFirstIndex = 0;
  let lSecondIndex = 0;

  while (
    lFirstIndex < lFirstViolations.length ||
    lSecondIndex < lSecondViolations.length
  ) {
    if (lFirstIndex >= lFirstViolations.length) {
      lNew.push(lSecondViolations[lSecondIndex]);
      lSecondIndex += 1;
      continue;
    }

    if (lSecondIndex >= lSecondViolations.length) {
      lOld.push(lFirstViolations[lFirstIndex]);
      lFirstIndex += 1;
      continue;
    }

    const lComparison = compareViolationsExSeverities(
      lFirstViolations[lFirstIndex],
      lSecondViolations[lSecondIndex],
    );

    if (lComparison === 0) {
      lSame.push(lFirstViolations[lFirstIndex]);
      lFirstIndex += 1;
      lSecondIndex += 1;
    } else if (lComparison < 0) {
      lOld.push(lFirstViolations[lFirstIndex]);
      lFirstIndex += 1;
    } else {
      lNew.push(lSecondViolations[lSecondIndex]);
      lSecondIndex += 1;
    }
  }

  return { new: lNew, same: lSame, old: lOld };
}

export function compareRules(pLeftRule, pRightRule) {
  return (
    compareSeverities(pLeftRule.severity, pRightRule.severity) ||
    pLeftRule.name.localeCompare(pRightRule.name)
  );
}

export function compareModules(pLeftModule, pRightModule) {
  return pLeftModule.source > pRightModule.source ? 1 : -1;
}
