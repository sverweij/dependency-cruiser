const expect                = require('chai').expect;
const validateFileExistence = require('../../../src/cli/utl/validateFileExistence');

describe("validateFileExistence", () => {
    it("throws when the file or dir passed does not exists", () => {
        try {
            validateFileExistence("file-or-dir-does-not-exist");
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: Can't open 'file-or-dir-does-not-exist' for reading. Does it exist?\n"
            );
        }
    });

    it("passes when the file or dir passed exists", () => {
        try {
            validateFileExistence("package.json");
            expect("getting here").to.equal("getting here");
        } catch (e) {
            expect("not to go into an exception").to.equal(e.message);
        }
    });
});
