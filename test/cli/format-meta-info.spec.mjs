import { equal } from "node:assert/strict";
import meta from "#cli/format-meta-info.mjs";

describe("[U] cli/formatMetaInfo - transpiler formatted meta information", () => {
  it("tells which extensions can be scanned", () => {
    equal(
      meta().includes("If you need a supported, but not enabled transpiler"),
      true,
    );
  });
});
