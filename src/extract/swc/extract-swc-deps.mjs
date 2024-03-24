import SwcDependencyVisitor from "./dependency-visitor.mjs";

/**
 * @param {import('@swc/core').ModuleItem[]} pSwcAST
 * @param {string[]} pExoticRequireStrings
 * @returns {{module: string, moduleSystem: string, dynamic: boolean}[]}
 */
export default function extractSwcDependencies(pSwcAST, pExoticRequireStrings) {
  const visitor = new SwcDependencyVisitor(pExoticRequireStrings);
  return visitor
    .getDependencies(pSwcAST)
    .map((pModule) => ({ dynamic: false, ...pModule }));
}
