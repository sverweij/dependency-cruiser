import { deepEqual } from "node:assert/strict";
import ModuleGraphWithDependencySet from "#graph-utl/module-graph-with-dependency-set.mjs";

function getDependents(pModule, pModules) {
  const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet(
    pModules,
  );
  return lModuleGraphWithDependencySet.getDependents(pModule);
}

describe("[U] graph-utl/module-graph-with-dependency-set - getDependents", () => {
  it("empty module without a source name & no modules yield no modules", () => {
    deepEqual(getDependents({}, []), []);
  });

  it("module & no modules yield no modules", () => {
    deepEqual(getDependents({ source: "itsme" }, []), []);
  });

  it("module & modules without any dependencies yield no modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [],
        },
      ]),
      [],
    );
  });

  it("module & modules with non-matching dependencies yield no modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }],
        },
      ]),
      [],
    );
  });

  it("module & module that's dependent yields that other module", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
        },
      ]),
      ["someoneelse"],
    );
  });

  it("module & modules that are dependent yields those other modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
        },
        {
          source: "someoneelse-again",
          dependencies: [
            { resolved: "notme" },
            { resolved: "notmeagain" },
            { resolved: "itsme" },
            { resolved: "itsnotmeeither" },
          ],
        },
      ]),
      ["someoneelse", "someoneelse-again"],
    );
  });
});

describe("[U] graph-utl/module-graph-with-dependency-set - moduleHasDependents", () => {
  it("returns false for an empty module without a source name & no modules", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([]);
    deepEqual(lModuleGraphWithDependencySet.moduleHasDependents({}), false);
  });

  it("returns false for a module when there are no modules in the graph", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([]);
    deepEqual(
      lModuleGraphWithDependencySet.moduleHasDependents({ source: "itsme" }),
      false,
    );
  });

  it("returns false for a module when no other modules depend on it", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([
      {
        source: "someoneelse",
        dependencies: [],
      },
    ]);
    deepEqual(
      lModuleGraphWithDependencySet.moduleHasDependents({ source: "itsme" }),
      false,
    );
  });

  it("returns false when modules have dependencies but none match", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([
      {
        source: "someoneelse",
        dependencies: [{ resolved: "itsnotme" }],
      },
    ]);
    deepEqual(
      lModuleGraphWithDependencySet.moduleHasDependents({ source: "itsme" }),
      false,
    );
  });

  it("returns true when a module has at least one dependent", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([
      {
        source: "someoneelse",
        dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
      },
    ]);
    deepEqual(
      lModuleGraphWithDependencySet.moduleHasDependents({ source: "itsme" }),
      true,
    );
  });

  it("returns true when a module has multiple dependents", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([
      {
        source: "someoneelse",
        dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
      },
      {
        source: "someoneelse-again",
        dependencies: [
          { resolved: "notme" },
          { resolved: "itsme" },
          { resolved: "itsnotmeeither" },
        ],
      },
    ]);
    deepEqual(
      lModuleGraphWithDependencySet.moduleHasDependents({ source: "itsme" }),
      true,
    );
  });

  it("returns false for a module that exists in the graph but has no dependents", () => {
    const lModuleGraphWithDependencySet = new ModuleGraphWithDependencySet([
      {
        source: "itsme",
        dependencies: [{ resolved: "someoneelse" }],
      },
      {
        source: "someoneelse",
        dependencies: [],
      },
    ]);
    deepEqual(
      lModuleGraphWithDependencySet.moduleHasDependents({ source: "itsme" }),
      false,
    );
  });
});
