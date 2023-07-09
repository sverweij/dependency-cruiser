import prettier from "prettier";
import normalizeNewline from "normalize-newline";

export default async function normalizeSource(pSource) {
  const lData = await prettier.format(pSource, { parser: "babel" });
  return normalizeNewline(lData);
}
