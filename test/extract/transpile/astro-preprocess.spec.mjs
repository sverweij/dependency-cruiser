import { equal } from "node:assert/strict";
import normalizeNewline from "normalize-newline";
import { preProcess } from "#extract/transpile/astro-preprocess.mjs";

const NO_HOIST_CASES = [
  {
    description: "no script",
    input: `---
const foo = 42;
---
<div>Hello</div>`,
    expected: `---
const foo = 42;
---
<div>Hello</div>`,
  },
  {
    description: "empty script tag unchanged",
    input: `<script></script>
<div>Hello</div>`,
    expected: `<script></script>
<div>Hello</div>`,
  },
  {
    description: "dynamic import() not hoisted",
    input: `<script>
const mod = await import("./dynamic.js");
mod.use();
</script>`,
    expected: `<script>
const mod = await import("./dynamic.js");
mod.use();
</script>`,
  },
  {
    description: "import statements outside script tags not hoisted",
    input: `---
---
<div>import foo from "./fake.js";</div>`,
    expected: `---
---
<div>import foo from "./fake.js";</div>`,
  },
];

const HOIST_CASES = [
  {
    description: "no frontmatter, script with import",
    input: `<script type="module">
import foo from "./foo.js";
</script>
<div>Hello</div>`,
    expected: `---
import foo from "./foo.js";
---
<script type="module"></script>
<div>Hello</div>`,
  },
  {
    description: "existing frontmatter, script with import",
    input: `---
const bar = 42;
---
<script>
import foo from "./foo.js";
</script>
<div>Hello</div>`,
    expected: `---
import foo from "./foo.js";
const bar = 42;
---
<script></script>
<div>Hello</div>`,
  },
  {
    description: "multiple script tags with multiple imports",
    input: `<script>
import foo from "./foo.js";
import bar from "./bar.js";
</script>
<div>Content</div>
<script>
import baz from "./baz.js";
const qux = await import("./dynamic.js");
</script>`,
    expected: `---
import foo from "./foo.js";
import bar from "./bar.js";
import baz from "./baz.js";
---
<script>
</script>
<div>Content</div>
<script>
const qux = await import("./dynamic.js");
</script>`,
  },
  {
    description: "CRLF line endings preserved",
    input: `<script>\r\nimport foo from "./foo.js";\r\n</script>\r\n<div>Hello</div>`,
    expected: `---\r\nimport foo from "./foo.js";\r\n---\r\n<script></script>\r\n<div>Hello</div>`,
  },
  {
    description: "import without semicolon gets semicolon added",
    input: `<script>
import foo from "./foo.js"
</script>`,
    expected: `---
import foo from "./foo.js";
---
<script></script>`,
  },
];

const IMPORT_SYNTAX_CASES = [
  {
    description: "handles imports with various quote styles",
    input: `<script>
import foo from './foo.js';
import bar from "./bar.js";
</script>`,
    expected: `---
import foo from './foo.js';
import bar from "./bar.js";
---
<script>
</script>`,
  },
  {
    description: "handles named imports",
    input: `<script>
import { named } from "./module.js";
import { a, b } from "./other.js";
</script>`,
    expected: `---
import { named } from "./module.js";
import { a, b } from "./other.js";
---
<script>
</script>`,
  },
  {
    description: "handles default and named imports together",
    input: `<script>
import defaultExport, { named } from "./module.js";
</script>`,
    expected: `---
import defaultExport, { named } from "./module.js";
---
<script></script>`,
  },
  {
    description: "handles namespace imports",
    input: `<script>
import * as Everything from "./module.js";
</script>`,
    expected: `---
import * as Everything from "./module.js";
---
<script></script>`,
  },
];

describe("[U] astro preprocessor", () => {
  describe("[U] cases where imports are NOT hoisted", () => {
    NO_HOIST_CASES.forEach((pTestCase, pIndex) => {
      it(`${pTestCase.description} (${pIndex + 1}/${NO_HOIST_CASES.length})`, () => {
        const lResult = preProcess(pTestCase.input);
        equal(normalizeNewline(lResult), normalizeNewline(pTestCase.expected));
      });
    });
  });

  describe("[U] cases where imports ARE hoisted to frontmatter", () => {
    HOIST_CASES.forEach((pTestCase, pIndex) => {
      it(`${pTestCase.description} (${pIndex + 1}/${HOIST_CASES.length})`, () => {
        const lResult = preProcess(pTestCase.input);
        equal(normalizeNewline(lResult), normalizeNewline(pTestCase.expected));
      });
    });
  });

  describe("[U] various import syntax styles", () => {
    IMPORT_SYNTAX_CASES.forEach((pTestCase, pIndex) => {
      it(`${pTestCase.description} (${pIndex + 1}/${IMPORT_SYNTAX_CASES.length})`, () => {
        const lResult = preProcess(pTestCase.input);
        equal(normalizeNewline(lResult), normalizeNewline(pTestCase.expected));
      });
    });
  });
});
