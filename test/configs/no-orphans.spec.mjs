import { equal } from "node:assert/strict";
import noOrphansRule from "../../configs/rules/no-orphans.cjs";
import { matchesOrphanRule } from "#validate/match-module-rule-helpers.mjs";

describe("[I] configs/rules/no-orphans", () => {
  it("flags non-excepted orphans as orphan rule transgression", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "Rémi.js",
        orphan: true,
      }),
      true,
    );
  });

  it("flags files ending on a dotfile as orphan rule transgression", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "looks-like-a-dot-sorta.Rémi.js",
        orphan: true,
      }),
      true,
    );
  });

  it("does not flag dot files as orphan rule transgressions", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: ".Rémi.js",
        orphan: true,
      }),
      false,
    );
  });

  it("does not flag dot files in the tree as orphan rule transgressions", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/.Rémi.js",
        orphan: true,
      }),
      false,
    );
  });

  it("does not flag dot files in the tree as orphan rule transgressions, regardless extension", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/.Rémi.ts",
        orphan: true,
      }),
      false,
    );
  });

  it("does not flag any .d.ts not as orphan rule transgressions", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/types/lalalal.d.ts",
        orphan: true,
      }),
      false,
    );
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "lalalal.d.ts",
        orphan: true,
      }),
      false,
    );
  });

  it("does not flag babel config files in the tree not as orphan rule transgressions", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "packages/thing/babel.config.mjs",
        orphan: true,
      }),
      false,
    );
  });

  it("does not flag babel config files as orphan rule transgressions", () => {
    equal(
      matchesOrphanRule(noOrphansRule, {
        source: "babel.config.mjs",
        orphan: true,
      }),
      false,
    );
  });
});
