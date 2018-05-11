const expect      = require('chai').expect;
const dotColoring = require('../../../src/report/dot/coloring');

describe("dot: severity2color", () => {
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
