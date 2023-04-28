import { expect } from "chai";
import ContentStrategy from "../../src/cache/content-strategy.mjs";

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
        changeType: "modified",
        name: "test/cache/__mocks__/calculate-shasum-of-this.aap",
      },
    ];
    const lExpected = {
      SHA1: DUMMY_SHA,
      changes: [
        {
          changeType: "modified",
          name: "test/cache/__mocks__/calculate-shasum-of-this.aap",
        },
      ],
    };

    expect(
      new ContentStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          shaRetrievalFn: () => DUMMY_SHA,
          diffListFn: () => lInputChanges,
        }
      )
    ).to.deep.equal(lExpected);
  });

  it("if there's no changes the change set contains the passed sha & an empty array", () => {
    expect(
      new ContentStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          shaRetrievalFn: () => DUMMY_SHA,
          diffListFn: () => [],
        }
      )
    ).to.deep.equal({
      SHA1: DUMMY_SHA,
      changes: [],
    });
  });

  it("returns only the extensions passed", () => {
    const lLimitedExtensions = new Set([".wim", ".noot"]);

    expect(
      new ContentStrategy().getRevisionData(
        ".",
        { modules: [] },
        { exclude: {}, includeOnly: {} },
        {
          extensions: lLimitedExtensions,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          baseDir: "test/cache/__mocks__/content-strategy/extensions-check",
        }
      )
    ).to.deep.equal({
      SHA1: DUMMY_SHA,
      changes: [
        {
          changeType: "added",
          name: "noot-extension-hence-returned.noot",
          checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
        },
      ],
    });
  });

  it("returns only the changeTypes passed", () => {
    const lLimitedChangeTypes = new Set(["added", "modified", "renamed"]);
    /** @type {import('watskeburt').IChange[]} */
    const lInputChanges = [
      {
        changeType: "added",
        name: "added-hence-returned.aap",
      },
      {
        changeType: "added",
        name: "added-hence-returned.noot",
      },
      {
        changeType: "ignored",
        name: "ignored-hence-ignored.aap",
      },
      {
        changeType: "renamed",
        name: "renamed-hence-returned.mies",
        oldName: "old-name.wim",
      },
      {
        changeType: "deleted",
        name: "deleted-hence-ignored.aap",
      },
      {
        changeType: "deleted",
        name: "untracked-hence-ignored.aap",
      },
    ];

    expect(
      new ContentStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: lLimitedChangeTypes,
          diffListFn: () => lInputChanges,
          checksumFn: dummyCheckSumFunction,
        }
      )
    ).to.deep.equal({
      SHA1: DUMMY_SHA,
      changes: [
        {
          changeType: "added",
          name: "added-hence-returned.aap",
        },
        {
          changeType: "added",
          name: "added-hence-returned.noot",
        },
        {
          changeType: "renamed",
          name: "renamed-hence-returned.mies",
          oldName: "old-name.wim",
        },
      ],
    });
  });
});

describe("[U] cache/content-strategy - revisionDataEqual", () => {
  const lChanges = [
    {
      changeType: "added",
      name: "added-hence-returned.aap",
      checksum: "dummy-checksum",
    },
    {
      changeType: "added",
      name: "added-hence-returned.noot",
      checksum: "dummy-checksum",
    },
    {
      changeType: "renamed",
      name: "renamed-hence-returned.mies",
      oldName: "old-name.wim",
      checksum: "dummy-checksum",
    },
  ];

  it("returns false when revision data objects don't exist", () => {
    expect(new ContentStrategy().revisionDataEqual(null, null)).to.equal(false);
  });

  it("returns false when old revision data object doesn't exist", () => {
    expect(
      new ContentStrategy().revisionDataEqual(null, {
        SHA1: "some-sha",
        changes: [],
      })
    ).to.equal(false);
  });

  it("returns false when new revision data object doesn't exist", () => {
    expect(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        null
      )
    ).to.equal(false);
  });

  it("returns false when changes are not equal", () => {
    expect(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: lChanges }
      )
    ).to.equal(false);
  });

  it("returns true when changes are equal", () => {
    expect(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: lChanges },
        { SHA1: "some-sha", changes: lChanges }
      )
    ).to.equal(true);
  });

  it("returns true when changes are equal  (even when neither contain changes)", () => {
    expect(
      new ContentStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: [] }
      )
    ).to.equal(true);
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
    /** @type {import("../..").IRevisionData} */
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

    expect(
      new ContentStrategy().prepareRevisionDataForSaving(
        lEmptyCruiseResult,
        lEmptyRevisionData
      )
    ).to.deep.equal(lExpectedCruiseResult);
  });

  it("adds checksums to modules in the cruise result", () => {
    /** @type {import("../..").ICruiseResult} */
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
    /** @type {import("../..").IRevisionData} */
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

    expect(
      new ContentStrategy().prepareRevisionDataForSaving(
        lEmptyCruiseResult,
        lEmptyRevisionData
      )
    ).to.deep.equal(lExpectedCruiseResult);
  });

  it("removes changes from the revision data that aren't different anymore from the cruise result", () => {
    /** @type {import("../..").ICruiseResult} */
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
    /** @type {import("../..").IRevisionData} */
    const lRevisionData = {
      SHA1: "shwoop",
      changes: [
        {
          changeType: "modified",
          name: "foo.js",
          checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
        },
        {
          changeType: "added",
          name: "added.js",
          checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
        },
        {
          changeType: "modified",
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
            changeType: "added",
            name: "added.js",
            checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
          },
          {
            changeType: "modified",
            name: "baz.js",
            checksum: "differentchecksumfromthing/=",
          },
        ],
      },
    };

    expect(
      new ContentStrategy().prepareRevisionDataForSaving(
        lCruiseResult,
        lRevisionData
      )
    ).to.deep.equal(lExpectedCruiseResult);
  });
});
