/* eslint n/file-extension-in-import: 0, no-unused-vars:0 */
import type {
  IAvailableExtension,
  IAvailableTranspiler,
} from "../../../types/dependency-cruiser.d.mts";

export interface ITranspilerWrapper {
  isAvailable: () => boolean;
  transpile: (
    pSource: string,
    pFileName?: string,
    pTranspilerOptions?: any,
  ) => string;
}

export function getWrapper(pExtension, pTranspileOptions): ITranspilerWrapper;

export const scannableExtensions: string[];

export const allExtensions: IAvailableExtension[];

export function getAvailableTranspilers(): IAvailableTranspiler[];
