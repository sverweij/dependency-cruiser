import * as sub from "./sub";

import * as thing from "./javascriptThing";

import {
  Ka,
  Ching
} from "./sub/kaching";

export {
  Ka,
  Ching
};

export * from "./sub/willBeReExported";

import * as path from "path";

console.log(sub.version, thing(2), '=== 8', path.delimiter);
