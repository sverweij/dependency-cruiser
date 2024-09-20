import { format } from "prettier";
import normalizeNewline from "normalize-newline";

export default async function normalizeSource(pSource) {
  const lData = await format(pSource, { parser: "babel" });
  return normalizeNewline(lData);
}
