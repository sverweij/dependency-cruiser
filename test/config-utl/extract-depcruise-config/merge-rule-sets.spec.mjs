import { deepEqual } from "node:assert/strict";
import merge from "../../../src/config-utl/extract-depcruise-config/merge-configs.mjs";

describe("[U] config-utl/mergeRuleSets - general", () => {
  it("two empty rule sets yield an empty rule set with named attributes", () => {
    deepEqual(merge({}, {}), {
      options: {},
    });
  });
});

describe("[U] config-utl/mergeRuleSets - forbidden", () => {
  it("extending empty forbidden yields that forbidden", () => {
    deepEqual(merge({ forbidden: [{ from: "src", to: "test" }] }, {}), {
      forbidden: [{ from: "src", to: "test" }],
      options: {},
    });
  });

  it("extending forbidden with something already in yields that forbidden (dedup)", () => {
    deepEqual(
      merge(
        { forbidden: [{ from: "src", to: "test" }] },
        { forbidden: [{ from: "src", to: "test" }] },
      ),
      {
        forbidden: [{ from: "src", to: "test" }],
        options: {},
      },
    );
  });

  it("extending forbidden with nothing yields that the base forbidden (dedup)", () => {
    deepEqual(merge({}, { forbidden: [{ from: "src", to: "test" }] }), {
      forbidden: [{ from: "src", to: "test" }],
      options: {},
    });
  });

  it("extending forbidden with something not yet in yields that forbidden + the extension", () => {
    deepEqual(
      merge(
        { forbidden: [{ from: "bin", to: "test" }] },
        { forbidden: [{ from: "src", to: "test" }] },
      ),
      {
        forbidden: [
          { from: "bin", to: "test" },
          { from: "src", to: "test" },
        ],
        options: {},
      },
    );
  });

  it("extending an existing named rule - the extended wins", () => {
    deepEqual(
      merge(
        { forbidden: [{ name: "already-in-base", from: "bin", to: "test" }] },
        { forbidden: [{ name: "already-in-base", from: "src", to: "test" }] },
      ),
      {
        forbidden: [{ name: "already-in-base", from: "bin", to: "test" }],
        options: {},
      },
    );
  });

  it("extending an existing named rule - keep attributes not in extended", () => {
    deepEqual(
      merge(
        {
          forbidden: [
            {
              name: "already-in-base",
              from: { path: "bin" },
              to: { path: "test" },
            },
          ],
        },
        {
          forbidden: [
            {
              name: "already-in-base",
              severity: "error",
              from: { path: "src" },
              to: { path: "test" },
            },
          ],
        },
      ),
      {
        forbidden: [
          {
            name: "already-in-base",
            severity: "error",
            from: { path: "bin" },
            to: { path: "test" },
          },
        ],
        options: {},
      },
    );
  });

  it("extending an existing named rule - adds attributes only in extended", () => {
    deepEqual(
      merge(
        {
          forbidden: [
            {
              name: "already-in-base",
              severity: "info",
              from: { path: "bin" },
              to: { path: "test" },
            },
          ],
        },
        {
          forbidden: [
            {
              name: "already-in-base",
              from: { path: "src" },
              to: { path: "test" },
            },
          ],
        },
      ),
      {
        forbidden: [
          {
            name: "already-in-base",
            severity: "info",
            from: { path: "bin" },
            to: { path: "test" },
          },
        ],
        options: {},
      },
    );
  });

  it("extending an existing named rule - adds attributes only in extended (which is very partial only)", () => {
    deepEqual(
      merge(
        { forbidden: [{ name: "already-in-base", severity: "info" }] },
        {
          forbidden: [
            {
              name: "already-in-base",
              from: { path: "src" },
              to: { path: "test" },
            },
          ],
        },
      ),
      {
        forbidden: [
          {
            name: "already-in-base",
            severity: "info",
            from: { path: "src" },
            to: { path: "test" },
          },
        ],
        options: {},
      },
    );
  });

  it("extending forbidden with a named rule not in there adds it", () => {
    deepEqual(
      merge(
        { forbidden: [{ name: "not-in-base", from: "bin", to: "test" }] },
        { forbidden: [{ name: "already-in-base", from: "src", to: "test" }] },
      ),
      {
        forbidden: [
          { name: "not-in-base", from: "bin", to: "test" },
          { name: "already-in-base", from: "src", to: "test" },
        ],
        options: {},
      },
    );
  });
});

describe("[U] config-utl/mergeRuleSets - allowed", () => {
  it("extending empty allowed yields that allowed", () => {
    deepEqual(merge({ allowed: [{ from: "test", to: "src" }] }, {}), {
      allowed: [{ from: "test", to: "src" }],
      allowedSeverity: "warn",
      options: {},
    });
  });

  it("extending allowed with something already in yields that allowed (dedup)", () => {
    deepEqual(
      merge(
        { allowed: [{ from: "test", to: "src" }] },
        { allowed: [{ from: "test", to: "src" }] },
      ),
      {
        allowed: [{ from: "test", to: "src" }],
        allowedSeverity: "warn",
        options: {},
      },
    );
  });

  it("extending allowed with nothing yields that the base allowed (dedup)", () => {
    deepEqual(merge({}, { allowed: [{ from: "test", to: "src" }] }), {
      allowed: [{ from: "test", to: "src" }],
      allowedSeverity: "warn",
      options: {},
    });
  });

  it("extending allowed with something not yet in yields that allowed + the extension", () => {
    deepEqual(
      merge(
        { allowed: [{ from: "bin", to: "test" }] },
        { allowed: [{ from: "src", to: "test" }] },
      ),
      {
        allowedSeverity: "warn",
        allowed: [
          { from: "bin", to: "test" },
          { from: "src", to: "test" },
        ],
        options: {},
      },
    );
  });
});

describe("[U] config-utl/mergeRuleSets - allowedSeverity", () => {
  it("extending empty set with only an allowedSeverity error yields no allowedSeverity", () => {
    deepEqual(merge({ allowedSeverity: "error" }, {}), {
      options: {},
    });
  });

  it("extending empty set with allowed + allowedSeverity error yields allowedSeverity error", () => {
    deepEqual(
      merge({}, { allowed: [{ from: {}, to: {} }], allowedSeverity: "error" }),
      {
        allowed: [{ from: {}, to: {} }],
        allowedSeverity: "error",
        options: {},
      },
    );
  });

  it("extending allowedSeverity error with nothing yields allowedSeverity error", () => {
    deepEqual(
      merge({ allowed: [{ from: {}, to: {} }], allowedSeverity: "error" }, {}),
      {
        allowed: [{ from: {}, to: {} }],
        allowedSeverity: "error",
        options: {},
      },
    );
  });

  it("extending allowedSeverity error with info yields allowedSeverity info", () => {
    deepEqual(
      merge(
        { allowedSeverity: "info" },
        { allowed: [{ from: {}, to: {} }], allowedSeverity: "error" },
      ),
      {
        allowed: [{ from: {}, to: {} }],
        allowedSeverity: "info",
        options: {},
      },
    );
  });
});

describe("[U] config-utl/mergeRuleSets - required", () => {
  it("extending an existing named rule - the extended wins", () => {
    deepEqual(
      merge(
        { required: [{ name: "already-in-base", from: "bin", to: "test" }] },
        { required: [{ name: "already-in-base", from: "src", to: "test" }] },
      ),
      {
        required: [{ name: "already-in-base", from: "bin", to: "test" }],
        options: {},
      },
    );
  });

  it("merging two disjunct required rule sets", () => {
    deepEqual(
      merge(
        { required: [{ name: "only-in-base", from: "bin", to: "test" }] },
        { required: [{ name: "only-in-extends", from: "src", to: "test" }] },
      ),
      {
        required: [
          { name: "only-in-base", from: "bin", to: "test" },
          { name: "only-in-extends", from: "src", to: "test" },
        ],
        options: {},
      },
    );
  });
});
describe("[U] config-utl/mergeRuleSets - options", () => {
  it("extending empty options with some options yield those options", () => {
    deepEqual(
      merge(
        {
          options: {
            doNotFollow: "node_modules",
            tsConfig: { fileName: "./tsConfig.json" },
          },
        },
        {},
      ),
      {
        options: {
          doNotFollow: "node_modules",
          tsConfig: {
            fileName: "./tsConfig.json",
          },
        },
      },
    );
  });

  it("extending some options with empty options yield those options", () => {
    deepEqual(
      merge(
        {},
        {
          options: {
            doNotFollow: "node_modules",
            tsConfig: { fileName: "./tsConfig.json" },
          },
        },
      ),
      {
        options: {
          doNotFollow: "node_modules",
          tsConfig: {
            fileName: "./tsConfig.json",
          },
        },
      },
    );
  });

  it("extending some options with some other options yield those options", () => {
    deepEqual(
      merge(
        { options: { tsConfig: {} } },
        {
          options: {
            doNotFollow: "node_modules",
            tsConfig: { fileName: "./tsConfig.json" },
          },
        },
      ),
      {
        options: {
          doNotFollow: "node_modules",
          tsConfig: {},
        },
      },
    );
  });
});
