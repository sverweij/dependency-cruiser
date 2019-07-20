const fs     = require("fs");
const expect = require('chai').expect;

module.exports = {
    assertFileEqual (pActualFileName, pExpectedFileName) {
        expect(
            fs.readFileSync(pActualFileName, {encoding: "utf8"})
        ).to.equal(
            fs.readFileSync(pExpectedFileName, {encoding: "utf8"})
        );
    },

    assertJSONFileEqual (pActualFileName, pExpectedFileName) {
        expect(
            JSON.parse(fs.readFileSync(pActualFileName, {encoding: "utf8"}))
        ).to.deep.equal(
            JSON.parse(fs.readFileSync(pExpectedFileName, {encoding: "utf8"}))
        );
    }
};
