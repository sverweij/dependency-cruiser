import * as types from "./pre-compilation-only";
import { doStuff } from "./real-deal";

const x: types.SomeType = "be";

export const thing = doStuff(x);
