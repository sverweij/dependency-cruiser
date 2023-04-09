import { expect } from "chai";
import noOrphansRule from "../../configs/rules/no-orphans.js";
import matchModuleRule from "../../src/validate/match-module-rule.mjs";

describe("[I] configs/rules/no-orphans", () => {
  it("flags non-excepted orphans as orphan rule transgression", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "Rémi.js",
        orphan: true,
      })
    ).to.deep.equal(true);
  });

  it("flags files ending on a dotfile as orphan rule transgression", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "looks-like-a-dot-sorta.Rémi.js",
        orphan: true,
      })
    ).to.deep.equal(true);
  });

  it("does not flag dot files as orphan rule transgressions", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: ".Rémi.js",
        orphan: true,
      })
    ).to.deep.equal(false);
  });

  it("does not flag dot files in the tree as orphan rule transgressions", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/.Rémi.js",
        orphan: true,
      })
    ).to.deep.equal(false);
  });

  it("does not flag dot files in the tree as orphan rule transgressions, regardless extension", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/.Rémi.ts",
        orphan: true,
      })
    ).to.deep.equal(false);
  });

  it("does not flag any .d.ts not as orphan rule transgressions", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/types/lalalal.d.ts",
        orphan: true,
      })
    ).to.deep.equal(false);
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "lalalal.d.ts",
        orphan: true,
      })
    ).to.deep.equal(false);
  });

  it("does not flag babel config files in the tree not as orphan rule transgressions", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/babel.config.mjs",
        orphan: true,
      })
    ).to.deep.equal(false);
  });

  it("does not flag babel config files as orphan rule transgressions", () => {
    expect(
      matchModuleRule.matchesOrphanRule(noOrphansRule, {
        source: "babel.config.mjs",
        orphan: true,
      })
    ).to.deep.equal(false);
  });
});
