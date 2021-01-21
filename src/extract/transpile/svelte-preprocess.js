/* eslint-disable no-magic-numbers */
/* eslint-disable security/detect-object-injection */
const _get = require("lodash/get");

/*
 parseAttributes copied verbatim from
 https://github.com/sveltejs/svelte/blob/67dea941bb1e61f0912ebd2257666b899c1ccefa/src/compiler/preprocess/index.ts#L27
 (plus/ minus some linter autofixes & renamed variables)
 Note this code can give results that might surprise; e.g. ''aap= "noot mies"'
 will yield { aap: true, '': '', '"noot': true, 'mies"': true } instead of
 {aap:"noot mies"}
 Leaving it be as it's the way svelte currently functions
 */
function parseAttributes(pString) {
  const lAttributes = {};
  pString
    .split(/\s+/)
    .filter(Boolean)
    .forEach((pAttribute) => {
      const lEqualsSignIndex = pAttribute.indexOf("=");
      if (lEqualsSignIndex === -1) {
        lAttributes[pAttribute] = true;
      } else {
        lAttributes[pAttribute.slice(0, lEqualsSignIndex)] = "'\"".includes(
          pAttribute[lEqualsSignIndex + 1]
        )
          ? pAttribute.slice(lEqualsSignIndex + 2, -1)
          : pAttribute.slice(lEqualsSignIndex + 1);
      }
    });
  return lAttributes;
}

function composeTranspilerOptions(pTranspilerOptions) {
  return {
    ...pTranspilerOptions,
    tsConfig: {
      ..._get(pTranspilerOptions, "tsConfig", {}),
      options: {
        ..._get(pTranspilerOptions, "tsConfig.options", {}),
        importsNotUsedAsValues: "preserve",
        jsx: "preserve",
      },
    },
  };
}

function getSourceReplacer(pTranspiler, pTranspilerOptions) {
  return (pMatch, pAttributes, pSource) => {
    const lAttributes = pAttributes || "";
    const lParsedAttributes = parseAttributes(lAttributes);

    if (lParsedAttributes.lang === "ts") {
      return `<script${lAttributes}>${pTranspiler(
        pSource,
        "dummy-filename",
        composeTranspilerOptions(pTranspilerOptions)
      )}</script>`;
    } else {
      return pMatch;
    }
  };
}

module.exports = function preProcess(
  pSource,
  pTranspilerWrapper,
  pTranspilerOptions
) {
  // regex from
  // github.com/sveltejs/svelte/blob/67dea941bb1e61f0912ebd2257666b899c1ccefa/src/compiler/preprocess/index.ts#L165
  // eslint-disable-next-line security/detect-unsafe-regex, unicorn/no-unsafe-regex
  const lScriptRegex = /<script(\s[^]*?)?(?:>([^]*?)<\/script>|\/>)/gi;

  if (pTranspilerWrapper.isAvailable) {
    return pSource.replace(
      lScriptRegex,
      getSourceReplacer(pTranspilerWrapper.transpile, pTranspilerOptions)
    );
  } else {
    return pSource;
  }
};
