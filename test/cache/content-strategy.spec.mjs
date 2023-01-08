import { expect } from "chai";
import {
  getRevisionData,
  revisionDataEqual,
} from "../../src/cache/content-strategy.js";

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
      getRevisionData(
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
      getRevisionData(
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

  // eslint-disable-next-line mocha/no-skipped-tests
  xit("returns only the extensions passed", () => {
    const lLimitedExtensions = new Set([".wim", ".noot"]);
    /** @type {import('watskeburt').IChange[]} */
    const lInputChanges = [
      {
        changeType: "added",
        name: "aap-extension-hence-ignored.aap",
      },
      {
        changeType: "added",
        name: "noot-extension-hence-returned.noot",
      },
      {
        changeType: "renamed",
        name: "old-name-has-extension-wim-hence-returned.mies",
        oldName: "wim-extension-hence-returned.wim",
      },
      {
        changeType: "deleted",
        name: "zus-extension-hence-ignored.zus",
      },
      {
        changeType: "deleted",
        name: "no-extension-hence-ignored",
      },
    ];

    expect(
      getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: lLimitedExtensions,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          shaRetrievalFn: () => DUMMY_SHA,
          diffListFn: () => lInputChanges,
          checksumFn: dummyCheckSumFunction,
        }
      )
    ).to.deep.equal({
      SHA1: DUMMY_SHA,
      changes: [
        {
          changeType: "added",
          name: "noot-extension-hence-returned.noot",
        },
        {
          changeType: "renamed",
          name: "old-name-has-extension-wim-hence-returned.mies",
          oldName: "wim-extension-hence-returned.wim",
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
      getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: lLimitedChangeTypes,
          shaRetrievalFn: () => DUMMY_SHA,
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
    expect(revisionDataEqual(null, null)).to.equal(false);
  });

  it("returns false when old revision data object doesn't exist", () => {
    expect(revisionDataEqual(null, { SHA1: "some-sha", changes: [] })).to.equal(
      false
    );
  });

  it("returns false when new revision data object doesn't exist", () => {
    expect(revisionDataEqual({ SHA1: "some-sha", changes: [] }, null)).to.equal(
      false
    );
  });

  it("returns false when changes are not equal", () => {
    expect(
      revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: lChanges }
      )
    ).to.equal(false);
  });

  it("returns true when changes are equal", () => {
    expect(
      revisionDataEqual(
        { SHA1: "some-sha", changes: lChanges },
        { SHA1: "some-sha", changes: lChanges }
      )
    ).to.equal(true);
  });

  it("returns true when changes are equal  (even when neither contain changes)", () => {
    expect(
      revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: [] }
      )
    ).to.equal(true);
  });
});
