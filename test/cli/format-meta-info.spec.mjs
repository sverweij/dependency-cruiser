import { expect } from "chai";
import meta from "../../src/cli/format-meta-info.mjs";

describe("[U] cli/formatMetaInfo - transpiler formatted meta information", () => {
  it("tells which extensions can be scanned", () => {
    expect(meta()).to.contain(
      "If you need a supported, but not enabled transpiler"
    );
  });
});
