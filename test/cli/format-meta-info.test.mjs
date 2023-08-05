import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import meta from "../../src/cli/format-meta-info.mjs";

describe("[U] cli/formatMetaInfo - transpiler formatted meta information", () => {
  it("tells which extensions can be scanned", () => {
    strictEqual(
      meta().includes("If you need a supported, but not enabled transpiler"),
      true
    );
  });
});
