import { deepEqual } from "node:assert/strict";
import { extractModuleAttributes } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - extractModuleAttributes", () => {
  it("leaves regular module specifications alone", () => {
    deepEqual(extractModuleAttributes("protodash"), {
      module: "protodash",
    });
  });

  it("extracts the protocol if there is one", () => {
    deepEqual(extractModuleAttributes("node:fs"), {
      module: "fs",
      protocol: "node:",
    });
  });

  it("leaves things alone the protocol is unknown", () => {
    deepEqual(extractModuleAttributes("nod:fs"), {
      module: "nod:fs",
    });
  });

  it("manages empty strings gracefully", () => {
    deepEqual(extractModuleAttributes(""), {
      module: "",
    });
  });

  it("extracts both protocol and mimeType when they're in the URI", () => {
    deepEqual(extractModuleAttributes("data:application/json,gegevens.json"), {
      module: "gegevens.json",
      protocol: "data:",
      mimeType: "application/json",
    });
  });

  it("handles emtpy mimeTypes gracefulley", () => {
    deepEqual(extractModuleAttributes("data:,gegevens.json"), {
      module: ",gegevens.json",
      protocol: "data:",
    });
  });

  it("treats comma's without a (known) protocol as part of the filename", () => {
    deepEqual(extractModuleAttributes("a com, ma.json"), {
      module: "a com, ma.json",
    });
  });

  it("when protocol separator is mistyped, returns it as part of the module name", () => {
    deepEqual(extractModuleAttributes("data:application/json;gegevens.json"), {
      module: "application/json;gegevens.json",
      protocol: "data:",
    });
  });
});
