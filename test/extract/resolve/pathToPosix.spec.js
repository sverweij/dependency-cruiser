"use strict";

const expect = require('chai').expect;
const pathToPosix = require('../../../src/extract/resolve/pathToPosix');

const gPathModuleWin32 = {
    sep: '\\',
    posix: {
        sep: '/'
    }
};

const gPathModulePosix = {
    sep: '/',
    posix: {
        sep: '/'
    }
};

describe("pathToPosix on win32", () => {
    it("transforms win32 style paths to posix ones: \"\"", () => {
        expect(
            pathToPosix("", gPathModuleWin32)
        ).to.equal("");
    });

    it("transforms win32 style paths to posix ones: \\root\\sub\\file.txt", () => {
        expect(
            pathToPosix("\\root\\sub\\file.txt", gPathModuleWin32)
        ).to.equal("/root/sub/file.txt");
    });

    it("keep posix style paths alone: /root/sub/file.txt", () => {
        expect(
            pathToPosix("/root/sub/file.txt", gPathModuleWin32)
        ).to.equal("/root/sub/file.txt");
    });
});

describe("pathToPosix on posix", () => {
    it("transforms win32 style paths to posix ones: \"\"", () => {
        expect(
            pathToPosix("", gPathModulePosix)
        ).to.equal("");
    });

    it("leaves win32 style paths alone: \\root\\sub\\file.txt", () => {
        expect(
            pathToPosix("\\root\\sub\\file.txt", gPathModulePosix)
        ).to.equal("\\root\\sub\\file.txt");
    });

    it("keep posix style paths alone: /root/sub/file.txt", () => {
        expect(
            pathToPosix("/root/sub/file.txt", gPathModulePosix)
        ).to.equal("/root/sub/file.txt");
    });
});
