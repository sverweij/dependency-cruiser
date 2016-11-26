const expect = require('chai').expect;
const fs     = require("fs");

module.exports = (() => {
    "use strict";

    return {
        assertFileEqual (pActualFileName, pExpectedFileName) {
            expect(
                fs.readFileSync(pActualFileName, {encoding: "utf8"})
            ).to.equal(
                fs.readFileSync(pExpectedFileName, {encoding: "utf8"})
            );
        }
    };
})();
