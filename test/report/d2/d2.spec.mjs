import { equal } from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import d2 from "#report/d2.mjs";

describe("[I] d2", () => {
  const lMocks = readdirSync("./test/report/d2/__mocks__");

  lMocks.forEach((pMock, pIndex, pArray) => {
    it(`renders a d2 - ${pMock}`, async () => {
      const lCruiseResult = await import(`./__mocks__/${pMock}`);
      const lExpected = readFileSync(
        `./test/report/d2/__fixtures__/${pMock.split(".").shift()}.d2`,
        { encoding: "utf8" },
      ).replace(/\r\n/g, "\n");
      const lActual = d2(lCruiseResult.default).output.replace(/\r\n/g, "\n");

      equal(lActual, lExpected);
    });
  });
});
