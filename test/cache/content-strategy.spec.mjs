import { deepEqual, equal } from "node:assert/strict";
import ContentStrategy from "#cache/content-strategy.mjs";

const INTERESTING_EXTENSIONS = new Set([".aap", ".noot", ".mies"]);
const INTERESTING_CHANGE_TYPES = new Set([
  "added",
  "copied",
  "deleted",
  "ignored",
  "modified",
  "renamed",
  "unmerged",
  "untracked",
]);
const DUMMY_SHA = "unknown-in-content-cache-strategy";
const dummyCheckSumFunction = (pChange) => ({
  ...pChange,
  checksum: "dummy-checksum",
});

describe("[U] cache/content-strategy - getRevisionData", () => {
  it("if a listed change does exist on disk shasum is calculated", () => {
    /** @type {import('watskeburt').IChange[]} */
    const lInputChanges = [
      {
        type: "modified",
        name: "test/cache/__mocks__/calculate-shasum-of-this.aap",
      },
    ];
    const lExpected = {
      SHA1: DUMMY_SHA,
      changes: [
        {
          type: "modified",
          name: "test/cache/__mocks__/calculate-shasum-of-this.aap",
        },
      ],
    };

    deepEqual(
      new ContentStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          shaRetrievalFn: () => DUMMY_SHA,
          diffListFn: () => lInputChanges,
        },
      ),
      lExpected,
    );
  });

  it("if there's no changes the change set contains the passed sha & an empty array", () => {
    deepEqual(
      new ContentStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          shaRetrievalFn: () => DUMMY_SHA,
          diffListFn: () => [],
        },
      ),
      {
        SHA1: DUMMY_SHA,
        changes: [],
      },
    );
  });

  it("returns only the extensions passed", () => {
    const lLimitedExtensions = new Set([".wim", ".noot"]);

    deepEqual(
      new ContentStrategy().getRevisionData(
        ".",
        { modules: [] },
        { exclude: {}, includeOnly: {} },
        {
          extensions: lLimitedExtensions,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          baseDir: "test/cache/__mocks__/content-strategy/extensions-check",
        },
      ),
      {
        SHA1: DUMMY_SHA,
        changes: [
          {
            type: "added",
            name: "noot-extension-hence-returned.noot",
            checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
          },
        ],
      },
    );
  });

  it("returns only the changeTypes passed", () => {
    const lLimitedChangeTypes = new Set(["added", "modified", "renamed"]);
    /** @type {import('watskeburt').IChange[]} */
    const lInputChanges = [
      {
        type: "added",
        name: "added-hence-returned.aap",
      },
      {
        type: "added",
        name: "added-hence-returned.noot",
      },
      {
        type: "ignored",
        name: "ignored-hence-ignored.aap",
      },
      {
        type: "renamed",
        name: "renamed-hence-returned.mies",
        oldName: "old-name.wim",
      },
      {
        type: "deleted",
        name: "deleted-hence-ignored.aap",
      },
      {
        type: "deleted",
        name: "untracked-hence-ignored.aap",
      },
    ];

    deepEqual(
      new ContentStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: lLimitedChangeTypes,
          diffListFn: () => lInputChanges,
          checksumFn: dummyCheckSumFunction,
        },
      ),
      {
        SHA1: DUMMY_SHA,
        changes: [
          {
            type: "added",
            name: "added-hence-returned.aap",
          },
          {
            type: "added",
            name: "added-hence-returned.noot",
          },
          {
            type: "renamed",
            name: "renamed-hence-returned.mies",
            oldName: "old-name.wim",
          },
        ],
      },
    );
  });
});

describe("[U] cache/content-strategy - revisionDataEqual", () => {
  const lChanges = [
    {
      type: "added",
      name: "added-hence-returned.aap",
      checksum: "dummy-checksum",
    },
    {
      type: "added",
      name: "added-hence-returned.noot",
      checksum: "dummy-checksum",
    },
    {
      type: "renamed",
      name: "renamed-hence-returned.mies",
      oldName: "old-name.wim",
      checksum: "dummy-checksum",
    },
  ];

  it("returns false when revision data objects don't exist", () => {
    equal(new ContentStrategy().revisionDataEqual(null, null), false);
  });

  it("returns false when old revision data object doesn't exist", () => {
    equal(
      new ContentStrategy().revisionDataEqual(null, {
        SHA1: "some-sha",
        changes: [],
      }),
      false,
    );
  });

  it("returns false when new revision data object doesn't exist", () => {
    equal(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        null,
      ),
      false,
    );
  });

  it("returns false when changes are not equal", () => {
    equal(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: lChanges },
      ),
      false,
    );
  });

  it("returns true when changes are equal", () => {
    equal(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: lChanges },
        { SHA1: "some-sha", changes: lChanges },
      ),
      true,
    );
  });

  it("returns true when changes are equal  (even when neither contain changes)", () => {
    equal(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: [] },
      ),
      true,
    );
  });
});

describe("[U] cache/content-strategy - prepareRevisionDataForSaving", () => {
  it("returns the input when there's no revision data", () => {
    const lEmptyCruiseResult = {
      modules: [],
      summary: {
        error: 0,
        warn: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {},
        totalCruised: 0,
        violations: [],
      },
    };
    /** @type {import("../../types/cruise-result.mjs").IRevisionData} */
    const lEmptyRevisionData = {
      SHA1: "shwoop",
      changes: [],
    };

    const lExpectedCruiseResult = {
      modules: [],
      summary: {
        error: 0,
        warn: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {},
        totalCruised: 0,
        violations: [],
      },
      revisionData: lEmptyRevisionData,
    };

    deepEqual(
      new ContentStrategy().prepareRevisionDataForSaving(
        lEmptyCruiseResult,
        lEmptyRevisionData,
      ),
      lExpectedCruiseResult,
    );
  });

  it("adds checksums to modules in the cruise result", () => {
    /** @type {import("../../types/cruise-result.mjs").ICruiseResult} */
    const lEmptyCruiseResult = {
      modules: [
        { source: "foo.js" },
        { source: "bar.js" },
        { source: "baz.js" },
        { source: "path", coreModule: true },
      ],
      summary: {
        error: 0,
        warn: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {
          baseDir:
            "test/cache/__mocks__/content-strategy/prepared-revision-data",
        },
        totalCruised: 0,
        violations: [],
      },
    };
    /** @type {import("../../types/cruise-result.mjs").IRevisionData} */
    const lEmptyRevisionData = {
      SHA1: "shwoop",
      changes: [],
    };

    const lExpectedCruiseResult = {
      modules: [
        { source: "foo.js", checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=" },
        { source: "bar.js", checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=" },
        { source: "baz.js", checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=" },
        { source: "path", coreModule: true },
      ],
      summary: {
        error: 0,
        warn: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {
          baseDir:
            "test/cache/__mocks__/content-strategy/prepared-revision-data",
        },
        totalCruised: 0,
        violations: [],
      },
      revisionData: lEmptyRevisionData,
    };

    deepEqual(
      new ContentStrategy().prepareRevisionDataForSaving(
        lEmptyCruiseResult,
        lEmptyRevisionData,
      ),
      lExpectedCruiseResult,
    );
  });

  it("removes changes from the revision data that aren't different anymore from the cruise result", () => {
    /** @type {import("../../types/cruise-result.mjs").ICruiseResult} */
    const lCruiseResult = {
      modules: [
        { source: "foo.js" },
        { source: "bar.js" },
        { source: "baz.js" },
        { source: "path", coreModule: true },
      ],
      summary: {
        error: 0,
        warn: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {
          baseDir:
            "test/cache/__mocks__/content-strategy/prepared-revision-data",
        },
        totalCruised: 0,
        violations: [],
      },
    };
    /** @type {import("../../types/cruise-result.mjs").IRevisionData} */
    const lRevisionData = {
      SHA1: "shwoop",
      changes: [
        {
          type: "modified",
          name: "foo.js",
          checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
        },
        {
          type: "added",
          name: "added.js",
          checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
        },
        {
          type: "modified",
          name: "baz.js",
          checksum: "differentchecksumfromthing/=",
        },
      ],
    };

    const lExpectedCruiseResult = {
      modules: [
        { source: "foo.js", checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=" },
        { source: "bar.js", checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=" },
        { source: "baz.js", checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=" },
        { source: "path", coreModule: true },
      ],
      summary: {
        error: 0,
        warn: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {
          baseDir:
            "test/cache/__mocks__/content-strategy/prepared-revision-data",
        },
        totalCruised: 0,
        violations: [],
      },
      revisionData: {
        SHA1: "shwoop",
        changes: [
          {
            type: "added",
            name: "added.js",
            checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
          },
          {
            type: "modified",
            name: "baz.js",
            checksum: "differentchecksumfromthing/=",
          },
        ],
      },
    };

    deepEqual(
      new ContentStrategy().prepareRevisionDataForSaving(
        lCruiseResult,
        lRevisionData,
      ),
      lExpectedCruiseResult,
    );
  });
});
