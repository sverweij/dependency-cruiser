import { expect } from "chai";
import MetaDataStrategy from "../../src/cache/metadata-strategy.mjs";

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
const DUMMY_SHA = "01234567890abcdef01234567890abcdef012345";
const dummyCheckSumFunction = (pChange) => ({
  ...pChange,
  checksum: "dummy-checksum",
});

describe("[U] cache/metadata-strategy - getRevisionData", () => {
  it("if the current folder isn't under version control, the function throws", async () => {
    let lError = "none";
    try {
      await new MetaDataStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          interestingChangeTypes: INTERESTING_CHANGE_TYPES,
          shaRetrievalFn: () => DUMMY_SHA,
          diffListFn: () => {
            throw new Error(
              "fatal: not a git repository (or any of the parent directories): .git"
            );
          },
        }
      );
    } catch (pError) {
      lError = pError.message;
    }
    expect(lError).to.match(/The --cache option works in concert with git/);
  });

  it("if one of the listed changes doesn't exist on disk it gets shasum 'file not found'", async () => {
    /** @type {import('watskeburt').IChange[]} */
    const lInputChanges = [
      {
        changeType: "modified",
        name: "file-does-not-exist.aap",
      },
    ];
    const lExpected = {
      SHA1: DUMMY_SHA,
      changes: [
        {
          changeType: "modified",
          name: "file-does-not-exist.aap",
          checksum: "file not found",
        },
      ],
    };

    expect(
      await new MetaDataStrategy().getRevisionData(
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

  it("if a listed change does exist on disk shasum is calculated", async () => {
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
          checksum: "2jmj7l5rSw0yVb/vlWAYkK/YBwk=",
        },
      ],
    };

    expect(
      await new MetaDataStrategy().getRevisionData(
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

  it("if there's no changes the change set contains the passed sha & an empty array", async () => {
    expect(
      await new MetaDataStrategy().getRevisionData(
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

  it("returns only the extensions passed", async () => {
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
      await new MetaDataStrategy().getRevisionData(
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
          checksum: "dummy-checksum",
        },
        {
          changeType: "renamed",
          name: "old-name-has-extension-wim-hence-returned.mies",
          oldName: "wim-extension-hence-returned.wim",
          checksum: "dummy-checksum",
        },
      ],
    });
  });

  it("returns only the changeTypes passed", async () => {
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
      await new MetaDataStrategy().getRevisionData(
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
      ],
    });
  });

  it("by default only returns a subset of change types", async () => {
    /** @type {import('watskeburt').IChange[]} */
    const lInputChanges = [
      {
        changeType: "added",
        name: "added-hence-returned.aap",
      },
      {
        changeType: "copied",
        name: "copied-hence-returned.noot",
      },
      {
        changeType: "deleted",
        name: "deleted-hence-returned.aap",
      },
      {
        changeType: "modified",
        name: "modified-hence-returned.mies",
        oldName: "old-name.wim",
      },
      {
        changeType: "renamed",
        name: "renamed-hence-returned.aap",
      },
      {
        changeType: "unmerged",
        name: "unmerged-hence-returned.aap",
      },
      {
        changeType: "untracked",
        name: "untracked-hence-returned.aap",
      },
      {
        changeType: "pairing broken",
        name: "pairing-broken-hence-ignored.aap",
      },
      {
        changeType: "unmodified",
        name: "unmodified-hence-ignored.aap",
      },
      {
        changeType: "type changed",
        name: "type-changed-hence-ignored.aap",
      },
      {
        changeType: "ignored",
        name: "ignored-hence-ignored.aap",
      },
    ];

    expect(
      await new MetaDataStrategy().getRevisionData(
        null,
        null,
        { exclude: {}, includeOnly: {} },
        {
          extensions: INTERESTING_EXTENSIONS,
          // interestingChangeTypes NOT specified here
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
          checksum: "dummy-checksum",
        },
        {
          changeType: "copied",
          name: "copied-hence-returned.noot",
          checksum: "dummy-checksum",
        },
        {
          changeType: "deleted",
          name: "deleted-hence-returned.aap",
          checksum: "dummy-checksum",
        },
        {
          changeType: "modified",
          name: "modified-hence-returned.mies",
          oldName: "old-name.wim",
          checksum: "dummy-checksum",
        },
        {
          changeType: "renamed",
          name: "renamed-hence-returned.aap",
          checksum: "dummy-checksum",
        },
        {
          changeType: "unmerged",
          name: "unmerged-hence-returned.aap",
          checksum: "dummy-checksum",
        },
        {
          changeType: "untracked",
          name: "untracked-hence-returned.aap",
          checksum: "dummy-checksum",
        },
      ],
    });
  });
});

describe("[U] cache/metadata-strategy - revisionDataEqual", () => {
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

  it("returns false when revision data objects are don't exist", () => {
    expect(new MetaDataStrategy().revisionDataEqual(null, null)).to.equal(
      false
    );
  });

  it("returns false when old revision data object doesn't exist", () => {
    expect(
      new MetaDataStrategy().revisionDataEqual(null, {
        SHA1: "some-sha",
        changes: [],
      })
    ).to.equal(false);
  });

  it("returns false when new revision data object doesn't exist", () => {
    expect(
      new MetaDataStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        null
      )
    ).to.equal(false);
  });

  it("returns false when sha-sums aren't equal", () => {
    expect(
      new MetaDataStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-other-sha", changes: [] }
      )
    ).to.equal(false);
  });

  it("returns false when sha-sums are equal, but changes are not", () => {
    expect(
      new MetaDataStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: lChanges }
      )
    ).to.equal(false);
  });

  it("returns true when sha-sums are equal, and changes are as well", () => {
    expect(
      new MetaDataStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: lChanges },
        { SHA1: "some-sha", changes: lChanges }
      )
    ).to.equal(true);
  });

  it("returns true when sha-sums are equal, and changes are as well (even when neither contain changes)", () => {
    expect(
      new MetaDataStrategy().revisionDataEqual(
        { SHA1: "some-sha", changes: [] },
        { SHA1: "some-sha", changes: [] }
      )
    ).to.equal(true);
  });
});
