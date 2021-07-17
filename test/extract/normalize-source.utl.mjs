import prettier from "prettier";
import normalizeNewline from "normalize-newline";

export default function normalizeSource(pSource) {
  return normalizeNewline(prettier.format(pSource, { parser: "babel" }));
}
