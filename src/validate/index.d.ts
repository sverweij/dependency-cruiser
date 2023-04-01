/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable import/no-unresolved */
import {
  IDependency,
  IFolder,
  IFolderDependency,
  IModule,
  IFlattenedRuleSet,
} from "../../types/cruise-result";
import { SeverityType } from "../../types/shared-types";

export interface IValidationResult {
  /**
   * true if the relation between pFrom and pTo is valid (as far as the
   * given ruleset is concerend).
   * false in all other cases.
   */
  valid: boolean;
  /**
   * violated rule. Only present when the result of the validation is
   * _not_ valid
   */
  rules?: {
    /**
     * Name of the violated rule (taken from the rule set)
     */
    name: string;
    /**
     * Severity of the violation (taken from the rule set)
     */
    severity: SeverityType;
  }[];
}

/**
 * Validates the pModule module against the given
 * ruleset pRuleSet
 */
export function module(
  pRuleSet: IFlattenedRuleSet,
  pModule: IModule
): IValidationResult;

/**
 * Validates the pFrom and pTo dependency pair against the given
 * ruleset pRuleSet
 */
export function dependency(
  pRuleSet: IFlattenedRuleSet,
  pFrom: IModule,
  pTo: IDependency
): IValidationResult;

/**
 * Validates the pFrom and pTo dependency pair against the given
 * ruleset pRuleSet
 */
export function folder(
  pRuleSet: IFlattenedRuleSet,
  pFromFolder: IFolder,
  pToFolder: IFolderDependency
): IValidationResult;
