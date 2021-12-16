import doSomething from "./do-something.js";
import doSomethingElse from "./do-something-else.js";

export default (pEntry) => doSomething(doSomethingElse(pEntry));
