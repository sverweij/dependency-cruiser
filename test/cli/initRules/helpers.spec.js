const expect         = require('chai').expect;
const {pnpIsEnabled} = require('../../../src/cli/initConfig/helpers');

describe('src/cli/initConfig/helpers - pnpIsEnabled', (() => {
    const WORKINGDIR = process.cwd();

    afterEach("tear down", () => {
        process.chdir(WORKINGDIR);
    });

    it('returns false when there is no package.json', () => {
        process.chdir('test/cli/fixtures/init-config/pnpIsEnabled/no-package-json-here');
        expect(pnpIsEnabled()).to.equal(false);
    });

    it('returns false when the package.json is invalid json', () => {
        process.chdir('test/cli/fixtures/init-config/pnpIsEnabled/package-json-invalid');
        expect(pnpIsEnabled()).to.equal(false);
    });

    it('returns false when the package.json does not contain the installConfig key', () => {
        process.chdir('test/cli/fixtures/init-config/pnpIsEnabled/no-installConfig-key');
        expect(pnpIsEnabled()).to.equal(false);
    });

    it('returns false when the package.json contains the installConfig key, but not the pnp subkey', () => {
        process.chdir('test/cli/fixtures/init-config/pnpIsEnabled/pnp-attribute-missing');
        expect(pnpIsEnabled()).to.equal(false);
    });

    it('returns false when the package.json contains the installConfig key, but the pnp subkey === false', () => {
        process.chdir('test/cli/fixtures/init-config/pnpIsEnabled/pnp-attribute-false');
        expect(pnpIsEnabled()).to.equal(false);
    });

    it('returns true when the package.json contains the installConfig.pnp key, with value true', () => {
        process.chdir('test/cli/fixtures/init-config/pnpIsEnabled/pnp-attribute-true');
        expect(pnpIsEnabled()).to.equal(true);
    });
}));
