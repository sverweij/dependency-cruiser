export interface ITranspilerWrapper {
  isAvailable: () => boolean;
  transpile: (
    pSource: string,
    pFileName?: string,
    pTranspilerOptions?: any
  ) => string;
}

export type getWrapper = (pExtension, pTranspileOptions) => ITranspilerWrapper;

export const scannableExtensions: string[];

export const allExtensions: string[];

export interface IAvailableTranspiler {
  name: string;
  version: string;
  available: boolean;
}

export type getAvailableTranspilers = () => IAvailableTranspiler[];
