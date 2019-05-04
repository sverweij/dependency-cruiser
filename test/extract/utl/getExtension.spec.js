const expect      = require('chai').expect;
const getExtension = require('../../../src/extract/utl/getExtension');

describe("extract/utl/getExtension", () => {
    it(".coffee.md classifies as .coffee.md", () => {
        expect(
            getExtension("./aap/noot/mies.coffee.md")
        ).to.equal(".coffee.md");
    });

    it(".tea.md classifies as .md", () => {
        expect(
            getExtension("./aap/noot/mies.tes.md")
        ).to.equal(".md");
    });

    it("any extension (e.g. .js) classifies as that", () => {
        expect(
            getExtension("./aap/noot/mies.js")
        ).to.equal(".js");
    });

    it("no extension classifies as nothing", () => {
        expect(
            getExtension("./aap/noot/mies")
        ).to.equal("");
    });
});
