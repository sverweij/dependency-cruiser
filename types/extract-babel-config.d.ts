/**
 * Reads the file with name `pBabelConfigFileName` and returns its parsed
 * contents as an object
 *x
 * Silently fails if a supported @babel/core version can't be found
 *
 * @param pBabelConfigFileName
 * @return babel config as an object
 * @throws when the babel config has an unknown extension OR
 *         when the babel config is invalid OR
 *         when dependency-cruiser can't yet process it
 */
export default function extractBabelConfig(
  pBabelConfigFileName: string
): Promise<object>;

// regarding the rather unspecific _object_ type - this is what's
// currently specified on definitelyTyped for @babel/core:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b93ba16b8e482e66f7a82c426096ae31e1311710/types/babel__core/index.d.ts#L614
