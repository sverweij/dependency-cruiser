const fs = require('fs');

function runTest(){
    let lReturnValue = {
        message: "reading and/ or parsing the result of the integration test failed",
        exitCode: 1
    };

    try {
        const lDependencyGraph = JSON.parse(
            fs.readFileSync('dependencygraph.json', 'utf8')
        );

        if (!lDependencyGraph.hasOwnProperty('summary')) {
            lReturnValue.message = "dependency graph has no summary";
            return lReturnValue;
        }

        if (lDependencyGraph.summary.violations[0].rule.name !== "not-to-unresolvable") {
            lReturnValue.message = "didn't detect unresolvable module";
            return lReturnValue;
        }

        if (lDependencyGraph.summary.totalCruised !== 6) {
            lReturnValue.message = `should've cruised 6 modules, but it's ${lDependencyGraph.summary.totalCruised}`;
            return lReturnValue;
        }

        lReturnValue.message = "everything seems to be fine";
        lReturnValue.exitCode = 0;
        return lReturnValue;

    } catch (e) {
        // ignore - will return non-zero exit code anyway
        lReturnValue.message = "reading and/ or parsing the result of the integration test failed";

        return lReturnValue;
    }
}


const lResult = runTest();

console.log("integration test:", lResult.message);
process.exit(lResult.exitCode);
