const localNpmHelpers = require('./localNpmHelpers');

module.exports = {
    addLicenseAttribute(pModuleName, pBaseDir) {
        let lRetval = {};
        const lLicense = localNpmHelpers.getLicense(pModuleName, pBaseDir);

        if (Boolean(lLicense)) {
            lRetval.license = lLicense;
        }
        return lRetval;
    }
};
