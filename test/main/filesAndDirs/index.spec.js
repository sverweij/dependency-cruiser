const expect    = require('chai').expect;
const filesAndDirs = require('../../../src/main/filesAndDirs');

describe("main/filesAndDirs", () => {
    it("Keeps an empty file dir array as is", () => {
        expect(
            filesAndDirs.normalize(
                []
            )
        ).to.deep.equal(
            []
        );
    });

    it("Keeps relative paths as is", () => {
        expect(
            filesAndDirs.normalize(
                ["./src", "./test"]
            )
        ).to.deep.equal(
            ["./src", "./test"]
        );
    });

    it("Keeps relative paths as is - keeping globs in tact", () => {
        expect(
            filesAndDirs.normalize(
                ["{src,test}/**/*.js"]
            )
        ).to.deep.equal(
            ["{src,test}/**/*.js"]
        );
    });

    it("Normalizes absolute paths to paths relative to the current working dir", () => {
        expect(
            filesAndDirs.normalize(
                [__dirname]
            )
        ).to.deep.equal(
            ["test/main/filesAndDirs"]
        );
    });

    it("Normalizes absolute paths to paths relative to the current working dir keeping globs in tact", () => {
        expect(
            filesAndDirs.normalize(
                [`${__dirname}/**/*.{js,ts}`]
            )
        ).to.deep.equal(
            ["test/main/filesAndDirs/**/*.{js,ts}"]
        );
    });
});
