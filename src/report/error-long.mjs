import error from "./error.mjs";

export default function errorLong(pResults, pOptions) {
  return error(pResults, { ...pOptions, long: true });
}
