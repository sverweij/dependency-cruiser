const DOT_FILE_PATTERN = "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$";
const TS_DECLARATION_FILE_PATTERN = "\\.d\\.ts$";
const TS_CONFIG_FILE_PATTERN = "(^|/)tsconfig\\.json$";
const OTHER_CONFIG_FILES_PATTERN =
  "(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$";

const KNOWN_CONFIG_FILE_PATTERNS = [
  DOT_FILE_PATTERN,
  TS_DECLARATION_FILE_PATTERN,
  TS_CONFIG_FILE_PATTERN,
  OTHER_CONFIG_FILES_PATTERN,
].join("|");

module.exports = {
  name: "no-orphans",
  comment:
    "This is an orphan module - it's likely not used (anymore?). Either use it or " +
    "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
    "add an exception for it in your dependency-cruiser configuration. By default " +
    "this rule does not scrutinize dotfiles (e.g. .eslintrc.js), TypeScript declaration " +
    "files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
  severity: "warn",
  from: {
    orphan: true,
    pathNot: KNOWN_CONFIG_FILE_PATTERNS,
  },
  to: {},
};
