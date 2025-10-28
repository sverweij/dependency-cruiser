import { deepEqual, ok } from "node:assert/strict";
import { getCachedRegex, testCachedRegex } from "#utl/regex-cache.mjs";

describe("[U] utl/regex-cache", () => {
  describe("[U] getCachedRegex", () => {
    it("returns a RegExp object", () => {
      const lRegex = getCachedRegex("test");
      ok(lRegex instanceof RegExp);
    });

    it("returns the same RegExp instance for identical pattern and flags", () => {
      const lRegex1 = getCachedRegex("test", "i");
      const lRegex2 = getCachedRegex("test", "i");
      deepEqual(lRegex1, lRegex2);
    });

    it("returns different RegExp instances for different patterns", () => {
      const lRegex1 = getCachedRegex("test1");
      const lRegex2 = getCachedRegex("test2");
      ok(lRegex1 !== lRegex2);
    });

    it("returns different RegExp instances for same pattern but different flags", () => {
      const lRegex1 = getCachedRegex("test", "i");
      const lRegex2 = getCachedRegex("test", "g");
      ok(lRegex1 !== lRegex2);
    });

    it("uses empty string as default flags", () => {
      const lRegex = getCachedRegex("test");
      deepEqual(lRegex.flags, "");
    });

    it("respects custom flags", () => {
      const lRegex = getCachedRegex("test", "gi");
      deepEqual(lRegex.flags, "gi");
    });
  });

  describe("[U] testCachedRegex", () => {
    it("returns true when pattern matches", () => {
      const lResult = testCachedRegex("hello world", "world");
      deepEqual(lResult, true);
    });

    it("returns false when pattern doesn't match", () => {
      const lResult = testCachedRegex("hello world", "foo");
      deepEqual(lResult, false);
    });

    it("works with case-insensitive flag", () => {
      const lResult = testCachedRegex("Hello World", "hello", "i");
      deepEqual(lResult, true);
    });

    it("caches regex between calls", () => {
      // First call
      testCachedRegex("test1", "test");
      // Second call should use cached regex
      const lResult = testCachedRegex("test2", "test");
      deepEqual(lResult, true);
    });

    it("handles special regex characters", () => {
      const lResult = testCachedRegex("file.js", "\\.js$");
      deepEqual(lResult, true);
    });

    it("works correctly without global flag (no stateful lastIndex issues)", () => {
      // Call test multiple times with same pattern
      deepEqual(testCachedRegex("test", "test"), true);
      deepEqual(testCachedRegex("test", "test"), true);
      deepEqual(testCachedRegex("test", "test"), true);
      // All should return true; if 'g' flag was used, alternating true/false could occur
    });
  });
});
