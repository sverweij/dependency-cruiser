import { strictEqual } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { anonymizePath } from "../../../src/report/anon/anonymize-path.mjs";
import { clearCache } from "../../../src/report/anon/anonymize-path-element.mjs";

describe("[U] report/anon/anonymizePath", () => {
  beforeEach(() => {
    clearCache();
  });

  it("'' => ''", () => {
    strictEqual(anonymizePath(""), "");
  });

  it("'////' => '////'", () => {
    strictEqual(anonymizePath("////"), "////");
  });

  it("replaces with words from the word list", () => {
    strictEqual(
      anonymizePath("src/tien/kleine/geitjes/index.ts", ["foo", "bar", "baz"]),
      "src/foo/bar/baz/index.ts"
    );
  });

  it("repeat calls with similar paths yield similar anon paths", () => {
    const lWords = ["aap", "noot", "mies", "wim", "zus", "jet", "heide"];

    strictEqual(
      anonymizePath("src/tien/kleine/geitjes/index.ts", lWords),
      "src/aap/noot/mies/index.ts"
    );

    strictEqual(
      anonymizePath("src/tien/kleine/geitjes/tien.ts", lWords),
      "src/aap/noot/mies/aap.ts"
    );

    strictEqual(
      anonymizePath("shwoop/tien/grote/geiten/index.ts", lWords),
      "wim/aap/zus/jet/index.ts"
    );

    strictEqual(
      anonymizePath("test/tien/kleine/geitjes/tien.spec.ts", lWords),
      "test/aap/noot/mies/aap.spec.ts"
    );
  });
});
