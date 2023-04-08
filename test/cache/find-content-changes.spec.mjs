import { expect } from "chai";
import findContentChanges from "../../src/cache/find-content-changes.mjs";

describe("[U] cache/find-content-changes - cached vs new", () => {
  it("returns files not in directory but in cache as 'ignored' when they're not interesting for diffing", () => {
    expect(
      findContentChanges(
        ".",
        {
          modules: [
            {
              source: "consolidated",
              consolidated: true,
            },
            {
              source: "path",
              coreModule: true,
            },
            {
              source: "could-not-resolve.js",
              couldNotResolve: true,
            },
            {
              source: "node_modules/matches-do-not/follow.js",
              matchesDoNotFollow: true,
            },
          ],
        },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/empty-folder",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "consolidated",
        changeType: "ignored",
      },
      {
        name: "path",
        changeType: "ignored",
      },
      {
        name: "could-not-resolve.js",
        changeType: "ignored",
      },
      {
        name: "node_modules/matches-do-not/follow.js",
        changeType: "ignored",
      },
    ]);
  });

  it("returns files not in directory but in cache as 'deleted'", () => {
    expect(
      findContentChanges(
        ".",
        { modules: [{ source: "only-in-cache-ends-up-as-deleted.js" }] },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/empty-folder",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "only-in-cache-ends-up-as-deleted.js",
        changeType: "deleted",
      },
    ]);
  });

  it("returns files that have been earmarked as not followable as 'ignored'", () => {
    expect(
      findContentChanges(
        ".",
        {
          modules: [
            {
              source: "not-in-content-changes-as-extension.weird",
              followable: false,
            },
          ],
        },
        {
          baseDir:
            "test/cache/__mocks__/find-content-changes/folder-with-unfollowable-extensions",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "not-in-content-changes-as-extension.weird",
        changeType: "ignored",
      },
    ]);
  });

  it("returns files both in directory and in cache that are different as 'modified'", () => {
    expect(
      findContentChanges(
        ".",
        {
          modules: [
            {
              source: "in-folder-as-well-different-checksum.js",
              checksum: "completely-different-checksum",
            },
            {
              source: "in-folder-as-well-no-checksum.js",
            },
          ],
        },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/both-modified",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "in-folder-as-well-different-checksum.js",
        changeType: "modified",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
      {
        name: "in-folder-as-well-no-checksum.js",
        changeType: "modified",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
    ]);
  });

  it("returns files both in directory and in cache that are the same as 'unmodified'", () => {
    expect(
      findContentChanges(
        ".",
        {
          modules: [
            {
              source: "in-folder-as-well-unmodified.js",
              checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
            },
          ],
        },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/unmodified",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "in-folder-as-well-unmodified.js",
        changeType: "unmodified",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
    ]);
  });
});

describe("[U] cache/find-content-changes - new vs cached", () => {
  it("returns an empty set when the directory and modules are empty", () => {
    expect(
      findContentChanges(
        ".",
        { modules: [] },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/empty-folder",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([]);
  });

  it("returns changes when there's file in the directory and modules is empty (extensions only)", () => {
    expect(
      findContentChanges(
        ".",
        { modules: [] },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/extensions-only",
          exclude: {},
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "interesting-extension.js",
        changeType: "added",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
    ]);
  });

  it("returns changes when there's file in the directory and modules is empty (missing includeOnly filter)", () => {
    expect(
      findContentChanges(
        ".",
        { modules: [] },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/extensions-only",
          exclude: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "interesting-extension.js",
        changeType: "added",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
    ]);
  });

  it("returns changes when there's file in the directory and modules is empty (exclude filter)", () => {
    expect(
      findContentChanges(
        ".",
        { modules: [] },
        {
          baseDir: "test/cache/__mocks__/find-content-changes/exclude-filter",
          exclude: { path: "^excluded-.*" },
          includeOnly: {},
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "interesting-extension.js",
        changeType: "added",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
    ]);
  });

  it("returns changes when there's file in the directory and modules is empty (includeOnly filter)", () => {
    expect(
      findContentChanges(
        ".",
        { modules: [] },
        {
          baseDir:
            "test/cache/__mocks__/find-content-changes/include-only-filter",
          exclude: {},
          includeOnly: { path: "^interesting-.*" },
          extensions: new Set([".js"]),
        }
      )
    ).to.deep.equal([
      {
        name: "interesting-as-well.js",
        changeType: "added",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
      {
        name: "interesting-extension.js",
        changeType: "added",
        checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
      },
    ]);
  });
});
