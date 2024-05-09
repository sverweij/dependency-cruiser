import { deepEqual } from "node:assert/strict";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import loadOptions from "#config-utl/extract-depcruise-options.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const mockDirectory = join(__dirname, "__mocks__", "depcruiseconfig");

describe("[I] config-utl/extract-depcruise-options", () => {
  it("correctly converts an empty configuration to options", async () => {
    const lFoundOptions = await loadOptions(join(mockDirectory, "empty.mjs"));
    deepEqual(lFoundOptions, {
      ruleSet: {},
      validate: false,
    });
  });

  it("correctly converts a configuration with a rule set to options", async () => {
    const lFoundOptions = await loadOptions(
      join(mockDirectory, "rules.sub-not-allowed-error.json"),
    );
    deepEqual(lFoundOptions, {
      ruleSet: {
        allowed: [{ from: {}, to: {} }],
        forbidden: [
          {
            name: "sub-not-allowed",
            severity: "error",
            from: {},
            to: {
              path: "sub",
            },
          },
        ],
      },
      validate: true,
    });
  });

  it("correctly converts a configuration with a rule set, & puts options in the right spot", async () => {
    const lFoundOptions = await loadOptions(
      join(mockDirectory, "rules.sub-not-allowed-error-with-options.json"),
    );
    deepEqual(lFoundOptions, {
      ruleSet: {
        allowed: [{ from: {}, to: {} }],
        forbidden: [
          {
            name: "sub-not-allowed",
            severity: "error",
            from: {},
            to: {
              path: "sub",
            },
          },
        ],
      },
      validate: true,
      includeOnly: ["src"],
      reporterOptions: {
        text: {
          highlightFocused: true,
        },
      },
      cache: {
        strategy: "metadata",
        compress: true,
      },
    });
  });
});
