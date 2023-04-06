import { fileURLToPath } from "node:url";
import path from "node:path";
import { expect } from "chai";
import loadConfig from "../../../src/config-utl/extract-depcruise-config/index.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const mockDirectory = path.join(__dirname, "__mocks__");

describe("[I] config-utl/extract-depcruise-config", () => {
  it("a rule set without an extends returns just that rule set", async () => {
    const fixture = await import(
      "./__mocks__/rules.sub-not-allowed-error.json",
      {
        assert: { type: "json" },
      }
    );
    expect(
      await loadConfig(
        path.join(mockDirectory, "rules.sub-not-allowed-error.json")
      )
    ).to.deep.equal(fixture.default);
  });

  it("a rule set with an extends returns that rule set, extending the mentioned base", async () => {
    const mergedFixture = await import("./__mocks__/extends/merged.json", {
      assert: { type: "json" },
    });
    expect(
      await loadConfig(path.join(mockDirectory, "extends/extending.json"))
    ).to.deep.equal(mergedFixture.default);
  });

  it("a rule set with an extends array (0 members) returns that rule set", async () => {
    expect(
      await loadConfig(
        path.join(
          mockDirectory,
          "extends/extending-array-with-zero-members.json"
        )
      )
    ).to.deep.equal({
      forbidden: [
        {
          name: "rule-from-the-base",
          from: {},
          to: {},
        },
      ],
    });
  });

  it("a rule set with an extends array (1 member) returns that rule set, extending the mentioned base", async () => {
    const mergedArrayOneFixture = await import(
      "./__mocks__/extends/merged-array-1.json",
      {
        assert: { type: "json" },
      }
    );
    expect(
      await loadConfig(
        path.join(mockDirectory, "extends/extending-array-with-one-member.json")
      )
    ).to.deep.equal(mergedArrayOneFixture.default);
  });

  it("a rule set with an extends array (>1 member) returns that rule set, extending the mentioned bases", async () => {
    const mergedArrayTwoFixture = await import(
      "./__mocks__/extends/merged-array-2.json",
      {
        assert: { type: "json" },
      }
    );
    expect(
      await loadConfig(
        path.join(
          mockDirectory,
          "extends/extending-array-with-two-members.json"
        )
      )
    ).to.deep.equal(mergedArrayTwoFixture.default);
  });

  it("a rule set with an extends from node_modules gets merged properly as well", async () => {
    expect(
      await loadConfig(
        path.join(mockDirectory, "extends/extending-from-node-modules.json")
      )
    ).to.deep.equal({
      allowed: [
        {
          from: {
            path: "src",
          },
          to: {
            path: "src",
          },
        },
      ],
      allowedSeverity: "warn",
      options: {
        doNotFollow: "node_modules",
      },
    });
  });

  it("borks on a circular extends (1 step)", async () => {
    const lMessageOutTake = `config is circular - ${path.join(
      mockDirectory,
      "extends/circular-one.js"
    )} -> ${path.join(mockDirectory, "extends/circular-two.js")} -> ${path.join(
      mockDirectory,
      "extends/circular-one.js"
    )}.`;
    let lError = "none";

    try {
      await loadConfig(path.join(mockDirectory, "extends/circular-one.js"));
    } catch (pError) {
      lError = pError.toString();
    }

    expect(lError).to.contain(lMessageOutTake);
  });
});
