/* eslint-disable no-magic-numbers, no-undefined */
import { equal } from "node:assert/strict";
import { has, get, set } from "#utl/object-util.mjs";

describe("[U] object-util", () => {
  describe("[U] has", () => {
    it("should return true if the object has the specified path", () => {
      const lObject = { a: { b: { c: 123 } } };
      equal(has(lObject, "a.b.c"), true);
    });

    it("should return false if the object does not have the specified path", () => {
      const lObject = { a: { b: { c: 123 } } };
      equal(has(lObject, "a.b.d"), false);
    });
  });

  describe("[U] get", () => {
    it("should return the value at the specified path", () => {
      const lObject = { a: { b: { c: 123 } } };
      equal(get(lObject, "a.b.c"), 123);
    });

    it("should return the default value if the path does not exist", () => {
      const lObject = { a: { b: { c: 123 } } };
      equal(get(lObject, "a.b.d", "default"), "default");
    });

    it("should return undefined if the path does not exist and no default value is provided", () => {
      const lObject = { a: { b: { c: 123 } } };
      equal(get(lObject, "a.b.d"), undefined);
    });
  });

  describe("[U] set", () => {
    it("should set the value at the specified path", () => {
      const lObject = { a: { b: { c: 123 } } };
      set(lObject, "a.b.c", 456);
      equal(lObject.a.b.c, 456);
    });

    it("should create nested objects if the path does not exist", () => {
      const lObject = {};
      set(lObject, "a.b.c", 123);
      equal(lObject.a.b.c, 123);
    });
  });
});
