import { expect } from "chai";
// eslint-disable-next-line node/file-extension-in-import
import * as svelteCompiler from "svelte/compiler";
import normalizeNewline from "normalize-newline";
import thing from "../../../src/extract/transpile/typescript-wrap.mjs";
import sveltePreProcess from "../../../src/extract/transpile/svelte-preprocess.mjs";

const typeScriptWrap = thing(false);

const CORPUS = [
  "<script>let i=42</script>",
  "<script lang='ts'>let i:number=42</script><div>wut</div>",
  "<script lang='leavealone'>let i=42</script><style>body{color:blue}</style><div>wut</div>",
  " <style> one </style> <script> one </script> <!-- <style> one </style> --> <!-- <script> one </script> --> <style> <!-- one --> </style> <script> <!-- one --> </script>",
  "<script>function f(<ReadOnly>pString:string):string {return pString.reverse()}</script><div><script>console.log('whoop')</script></div>",
  "<script hazoo>console.log(43)</script>",
  "<script hazoo=69>console.log(44)</script>",
  "<script lang='js'>console.log(713)</script><style></style>",
];

describe("[U] sync svelte pre-processor", () => {
  CORPUS.forEach((pInput, pCorpusNumber, pCorpus) => {
    it(`pre-processes svelte like svelte's preprocessor, but sync (${
      pCorpusNumber + 1
    }/${pCorpus.length})`, async () => {
      const lSyncResult = sveltePreProcess(pInput, typeScriptWrap, {});
      const lAsyncResult = await svelteCompiler.preprocess(pInput, {
        script: ({ content, attributes }) => {
          let lReturnValue = { code: content };

          if (attributes.lang === "ts" && typeScriptWrap.isAvailable()) {
            lReturnValue.code = typeScriptWrap.transpile(content, {
              tsConfig: {
                options: {
                  baseUrl: "./",
                  importsNotUsedAsValues: "preserve",
                  jsx: "preserve",
                },
              },
            });
          }
          return lReturnValue;
        },
      });

      expect(lSyncResult).to.equal(lAsyncResult.code);
    });
  });
  it("pre-processes svelte like svelte, but sync (with an unavailable wrapper)", async () => {
    const lInput = "<script lang='ts'>let i:number=42</script><div>wut</div>";
    const lSyncResult = sveltePreProcess(lInput, {}, {});
    const lAsyncResult = await svelteCompiler.preprocess(lInput, {});

    expect(lSyncResult).to.equal(lAsyncResult.code);
  });
  it("ignores style tags that require a pre-processor", () => {
    const lInput = `<script lang="ts">console.log(713)</script>
      <style lang="scss">
        button {
          background-color: blue;
          &:button {
            background-color: red;
          }
        }
      </style>
      <button on:click={increment}>
        count is {count}
      </button>`;
    const lExpected = `<script lang="ts">console.log(713);
</script>
      
      <button on:click={increment}>
        count is {count}
      </button>`;
    const lResult = sveltePreProcess(lInput, typeScriptWrap, {});

    expect(normalizeNewline(lResult)).to.equal(normalizeNewline(lExpected));
  });
});
