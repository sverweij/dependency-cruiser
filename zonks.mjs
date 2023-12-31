import path from "node:path";
import assert from "node:assert";
import resolve, { ResolverFactory } from "oxc-resolver";

console.log(resolve.sync(process.cwd(), "./zonks.mjs"));
// `resolve`
// assert(resolve.sync(process.cwd(), "./index.js").path, path.join(process.cwd(), 'index.js'));

// `ResolverFactory`
const resolver = new ResolverFactory({});
console.log(resolver.sync(process.cwd(), "./zonks.mjs"));
// const resolver = new ResolverFactory();
// assert(resolver.sync(process.cwd(), "./index.js").path, path.join(process.cwd(), 'index.js'));
