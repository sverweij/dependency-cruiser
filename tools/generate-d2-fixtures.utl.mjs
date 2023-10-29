import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import d2 from "#report/d2.mjs";

rmSync("./test/report/d2/__fixtures__", { recursive: true });
mkdirSync("./test/report/d2/__fixtures__");
readdirSync("./test/report/d2/__mocks__").forEach(async (pMock) => {
  const lCruiseResult = await import(`../test/report/d2/__mocks__/${pMock}`);
  const lD2Output = d2(lCruiseResult.default).output;
  writeFileSync(
    `./test/report/d2/__fixtures__/${pMock.split(".").shift()}.d2`,
    lD2Output,
  );
});
