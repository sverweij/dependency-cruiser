import { equal } from "node:assert/strict";
import wrapAndIndent from "#utl/wrap-and-indent.mjs";

describe("[U] utl/wrapAndIndent", () => {
  it("indents a short string", () => {
    equal(wrapAndIndent("short text"), "    short text");
  });

  it("wraps words that don't fit on a line", () => {
    equal(
      wrapAndIndent(`${"a".repeat(40)} ${"b".repeat(40)}`),
      `    ${"a".repeat(40)}\n    ${"b".repeat(40)}`,
    );
  });

  it("doesn't emit an empty line when the first word is longer than the max width", () => {
    const lLongWord = "x".repeat(80);

    equal(wrapAndIndent(`${lLongWord} tail`), `    ${lLongWord}\n    tail`);
  });

  it("puts a long word that follows a short one on its own line", () => {
    const lLongWord = "y".repeat(80);

    equal(
      wrapAndIndent(`short ${lLongWord} tail`),
      `    short\n    ${lLongWord}\n    tail`,
    );
  });
});
