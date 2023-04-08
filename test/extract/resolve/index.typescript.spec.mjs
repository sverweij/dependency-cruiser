import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import resolve from "../../../src/extract/resolve/index.mjs";
import normalizeResolveOptions from "../../../src/main/resolve-options/normalize.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const WORKING_DIRECTORY = process.cwd();

async function wrappedResolve(pModuleAttributes) {
  return resolve(
    pModuleAttributes,
    process.cwd(),
    process.cwd(),
    await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      {}
    )
  );
}

describe("[I] extract/resolve/index - typescript", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("resolves to ts before it considers vue", async () => {
    expect(
      resolve(
        {
          module: "./x",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "vue-last"),
        await normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "vue-last/x.ts",
    });
  });

  it("Resolves the .ts even when the import includes a (non-existing) .js with explicit extension", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-ts-even-when-imported-as-js"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-secretly-typescript.js",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-secretly-typescript.ts",
    });
  });

  it("Resolves the .js even when the import includes an existing .js with explicit extension and the .ts exists", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-js-even-when-imported-as-js"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-genuinely-javascript.js",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-genuinely-javascript.js",
    });
  });

  it("Does NOT resolve the .ts when the import includes a (non-existing) .cjs with explicit extension", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-ts-even-when-imported-as-js"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-secretly-typescript.cjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "./i-am-secretly-typescript.cjs",
    });
  });
  // cjs => cts
  it("Resolves the .cts when the import includes a (non-existing) .cjs with explicit extension (even when .d.cts exists)", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-cts-even-when-imported-as-cjs"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-secretly-typescript.cjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-secretly-typescript.cts",
    });
  });

  it("Resolves the .d.cts when the import includes a (non-existing) .cjs with explicit extension", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-d-cts-even-when-imported-as-cjs"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-secretly-typescript.cjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-secretly-typescript.d.cts",
    });
  });

  it("Resolves the .cjs when the import includes an existing .cjs with explicit extension and the .cts exists", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-cjs-when-imported-as-cjs"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-just-commonjs.cjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-just-commonjs.cjs",
    });
  });
  // mjs => mts
  it("Resolves the .mts when the import includes a (non-existing) .mjs with explicit extension (even when .d.mts exists)", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-mts-even-when-imported-as-mjs"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-secretly-typescript.mjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-secretly-typescript.mts",
    });
  });

  it("Resolves the .d.mts when the import includes a (non-existing) .mjs with explicit extension", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-d-mts-even-when-imported-as-mjs"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-secretly-typescript.mjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-secretly-typescript.d.mts",
    });
  });

  it("Resolves the .mjs when the import includes an existing .mjs with explicit extension and the .cts exists", async () => {
    process.chdir(
      "test/extract/resolve/__mocks__/resolve-to-mjs-when-imported-as-mjs"
    );
    expect(
      await wrappedResolve({
        module: "./i-am-just-esm.mjs",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-just-esm.mjs",
    });
  });

  it("Does NOT resolve to something non-typescript-ish when the import includes a (non-existing) .js with explicit extension", async () => {
    process.chdir("test/extract/resolve/__mocks__/donot-resolve-to-non-ts");
    expect(
      await wrappedResolve({
        module: "./there-is-a-cjs-variant-of-me-but-you-will-not-find-it.js",
        moduleSystem: "es6",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "./there-is-a-cjs-variant-of-me-but-you-will-not-find-it.js",
    });
  });

  it("resolves triple slash directives - local", async () => {
    process.chdir("test/extract/resolve/__mocks__/triple-slash-directives");
    expect(
      await wrappedResolve({
        module: "./hello",
        moduleSystem: "tsd",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "hello.ts",
    });
  });

  it("resolves triple slash directives - external", async () => {
    process.chdir("test/extract/resolve/__mocks__/triple-slash-directives");
    expect(
      await await wrappedResolve({
        module: "something",
        moduleSystem: "tsd",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["npm"],
      followable: true,
      resolved: "node_modules/something/index.js",
    });
  });
});
