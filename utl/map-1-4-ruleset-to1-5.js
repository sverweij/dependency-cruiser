const commander = require('commander');
const fs        = require('fs');

LEVEL2SEVERITY = {
	"error" : "error",
	"warning" : "warn",
	"information" : "info"
};

const convertRule = dep => {
	let lDep = JSON.parse(JSON.stringify(dep));
	delete lDep.from;
	delete lDep.to;
	delete lDep.level;

	let lRetval = Object.assign(
		lDep,
		dep.level ? {"severity" : LEVEL2SEVERITY[dep.level] || "warn" } : {},
		{from: { path: dep.from}, to: {path: dep.to}}
	);
	return lRetval;
}

function convert (pFileName) {
	let contents = JSON.parse(fs.readFileSync(pFileName, 'utf8'));
	
	return JSON.stringify(
			Object.assign(
			contents,
			contents.allowed ? { allowed: contents.allowed.map(convertRule) } : {},
			contents.forbidden ? { forbidden: contents.forbidden.map(convertRule) } : {}
		),
		null,
		"    "
	);
}

fs.writeFileSync(
	process.argv[2],
	convert(process.argv[2]),
	{encoding: "utf8", flag: "w"}
);
