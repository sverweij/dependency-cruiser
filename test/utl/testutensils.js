const assert = require("assert");
const fs     = require("fs");
const crypto = require("crypto");

module.exports = (() => {
    "use strict";

    const getBestAvailableHash = () =>
            ["ripemd160", "md5", "sha1"]
            .filter(pHash => crypto.getHashes().indexOf(pHash) > -1)[0];

    const hashString = pString => crypto
            .createHash(getBestAvailableHash())
            .update(pString)
            .digest("hex");

    return {
        assertFileEqual (pActualFileName, pExpectedFileName) {
            assert.equal(
                hashString(fs.readFileSync(pActualFileName, {encoding: "utf8"})),
                hashString(fs.readFileSync(pExpectedFileName, {encoding: "utf8"}))
            );
        }
    };
})();
