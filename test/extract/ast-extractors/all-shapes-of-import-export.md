Regular commonjs:

```typescript
require("./cjs-thing-execute");
const cjsThing = require("./cjs-thing");
const cjsThingThing = require("./cjs-thing").thing;
const wappie = require("zoinks!./wappie");
```

These all land up post compile time => can be handled by acorn/
the javascript AST.

In commonjs and AMD it's possible to either _rename_ or _wrap_ your require
functions either to hack around a particular issue (e.g. force require cache
to not be used, require modules that might not be there without having to
try catch, you're using the require keyword for something else) or just for
the lulz:

```javascript
const tryRequire = require("semver-try-require");
const need = require;
const whoadash = need("whoadash");
const dunnoItBeThere = tryRequire("nodash");
```

Export equals imports are specific for typescript:

```typescript
import thing = require("./thing-that-uses-export-equals");
```

They translate into

```javascript
var thing = require();
```

... which is neat & dandy unless your target is something
modern, in which case the typescript compiler barfs. In our
case (we're on ES2015 as compilation target in `extract/transpile`)
these things won't end up post compile either and will have to
be handled by surfing the typescript AST.

Dynamic imports are not in the javascript standard yet, but typescript
already has it:

```typescript
import("aju").then(aju => aju.paraplu());
```

Same shortcoming as the import `yadda = require('aju')` thing when
downcompiling - and likewise supported when ts-precompilation-deps
are _on_.

Regular (es6 style) imports need to be handled by surfing the typescript AST,
as the typescript compiler output won't contain references to types
nor references to modules that are unused

```typescript
import './import-for-side-effects';
import { SomeSingleExport } from './ts-thing';
import { SomeSingleExport as RenamedSingleExport } from './ts-thing';
import * as entireTsOtherThingAsVariable from './ts-other-thing';
import type { SomeType } from './some-module';
```

... as do (re-exports)

```typescript
export * from './StringValidator';
export { ReExport as RenamedReExport } from "./ts-thing-for-re-exports"
export * as utilities from "./utilities.js";
```

(take care not to ignore exports that are not a re-exports into account: `export thing;`)

... and triple-slash directives

```typescript
/// <reference path="..." />
/// <reference types="..." />
```
