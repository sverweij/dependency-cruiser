/* eslint-disable no-magic-numbers */
function severity2number(pSeverity) {
  const lSeverity2Number = new Map([
    ["error", 1],
    ["warn", 2],
    ["info", 3],
    ["ignore", 4],
  ]);

  return lSeverity2Number.get(pSeverity) || -1;
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

export function compareViolations(pFirstViolation, pSecondViolation) {
  return (
    compareSeverities(
      pFirstViolation.rule.severity,
      pSecondViolation.rule.severity,
    ) ||
    pFirstViolation.rule.name.localeCompare(pSecondViolation.rule.name) ||
    pFirstViolation.from.localeCompare(pSecondViolation.from) ||
    pFirstViolation.to.localeCompare(pSecondViolation.to) ||
    compareArraysByName(pFirstViolation.cycle, pSecondViolation.cycle) ||
    compareArraysByName(pFirstViolation.via, pSecondViolation.via)
  );
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
