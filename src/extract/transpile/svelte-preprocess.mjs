/* eslint-disable no-magic-numbers, security/detect-object-injection */
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
          pAttribute[lEqualsSignIndex + 1],
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
      ...(pTranspilerOptions?.tsConfig ?? {}),
      options: {
        ...(pTranspilerOptions?.tsConfig?.options ?? {}),
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
        composeTranspilerOptions(pTranspilerOptions),
      )}</script>`;
    } else {
      return pMatch;
    }
  };
}

function styleReplacer(pMatch, pAttributes) {
  const lParsedAttributes = parseAttributes(pAttributes || "");

  if (lParsedAttributes.lang === "css" || !pAttributes) {
    return pMatch;
  } else {
    return "";
  }
}

export default function preProcess(
  pSource,
  pTranspilerWrapper,
  pTranspilerOptions,
) {
  // regexes from
  // github.com/sveltejs/svelte/blob/67dea941bb1e61f0912ebd2257666b899c1ccefa/src/compiler/preprocess/index.ts#L165
  // eslint-disable-next-line security/detect-unsafe-regex
  const lScriptRegex = /<script(\s[^]*?)?(?:>([^]*?)<\/script>|\/>)/gi;
  // eslint-disable-next-line security/detect-unsafe-regex
  const lStyleRegex = /<style(\s[^]*?)?(?:>([^]*?)<\/style>|\/>)/gi;

  if (pTranspilerWrapper.isAvailable) {
    return (
      pSource
        .replace(
          lScriptRegex,
          getSourceReplacer(pTranspilerWrapper.transpile, pTranspilerOptions),
        )
        // we don't regard styling in our dependency analysis, so we can remove
        // styles that (our instance of) svelte doesn't have pre-processors
        // installed for (e.g. sass/scss/postcss/sss/styl/stylus/...) and that
        // can potentially get svelte compiler to error out (for an example see
        // https://github.com/sverweij/dependency-cruiser/issues/713)
        .replace(lStyleRegex, styleReplacer)
    );
  } else {
    return pSource;
  }
}
