const expect      = require('chai').expect;
const dotColoring = require('../../../../src/report/dot/common/coloring');

describe("report/dot/common - severity2color", () => {
    it("info => blue", () => {
        expect(dotColoring.severity2Color('info')).to.equal('blue');
    });
    it("warn => orange", () => {
        expect(dotColoring.severity2Color('warn')).to.equal('orange');
    });
    it("error => red", () => {
        expect(dotColoring.severity2Color('error')).to.equal('red');
    });
    it("everything else => red (default color)", () => {
        expect(dotColoring.severity2Color('fatal')).to.equal('red');
    });
});

describe("report/dot/common - determineModuleColors", () => {
    it("empty module => no colors", () => {
        expect(
            dotColoring.determineModuleColors({})
        ).to.deep.equal({});
    });

    it("core module => grey", () => {
        expect(
            dotColoring.determineModuleColors({coreModule: true})
        ).to.deep.equal({color:"grey", fontcolor:"grey"});
    });

    it("couldNotResolve => red", () => {
        expect(
            dotColoring.determineModuleColors({couldNotResolve: true})
        ).to.deep.equal({color:"red", fontcolor:"red"});
    });

    it("json => darker yellowish fillcolor", () => {
        expect(
            dotColoring.determineModuleColors({source: "package.json"})
        ).to.deep.equal({fillcolor:"#ffee44"});
    });
});
