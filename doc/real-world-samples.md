# Real world projects dependency cruised

## Some opular projects on npm

### Commander
[tj/commander.js](https://github.com/tj/commander.js) - For command line parsing - and cooking command line interfaces.

![commander](real-world-samples/commander.png)

### Chalk
[chalk/chalk](https://github.com/chalk/chalk) -
For coloring strings in the terminal. A typical _Sorhus style_ micro module that uses other micro modules to accomplish its goals.

![chalk](real-world-samples/chalk.png)

### Bluebird
[petkaantonov/bluebird](https://github.com/petkaantonov/bluebird) - promise library

![bluebird](real-world-samples/bluebird.png)

### Safe-regex
[substack/safe-regex](https://github.com/substack/safe-regex) - for sanity checking regular expressions against exponential time errors. For everyone who enables users to input regular expressions in.

![safe-regex](real-world-samples/safe-regex.png)

### Resolve
[substack/node-resolve](https://github.com/substack/node-resolve) - resolves (node) module names to files on disk.

![resolve](real-world-samples/resolve.png)

### Yargs
[yargs/yargs](https://github.com/yargs/yargs) - Another library to parse command line options/ cook command line interfaces.

![yargs](real-world-samples/yargs.png)


## My own projects
### dependency cruiser
Dependency cruiser used on itself. node_modules left out to keep it concise.

![dependency-cruiser-without-node_modules](real-world-samples/dependency-cruiser-without-node_modules.png)

### state machine cat
[sverweij/state-machine-cat](https://github.com/sverweij/state-machine-cat) - an interpreter for writing nice state diagrams.

![state-machine-cat-without-amdefine](real-world-samples/state-machine-cat-without-amdefine.png)

### mscgen.js
[mscgenjs/mscgenjs-core](https://github.com/mscgenjs/mscgenjs-core) - an interpreter library for turning text (in MscGen or two other DSLs) into sequence charts.

![mscgen.js](real-world-samples/mscgenjs-core-without-lodash-amdefine.png)


## Typescript
It is possible to use dependency-cruiser to infer dependencies of typescript
projects (and to validate them against sets of rules). For now it involves transpilation to javascript first (see [this gist](https://gist.github.com/sverweij/069a34c787982a7fea82d03d20a991f1) for a recipe).

### tslint
[palantir/tslint](https://github.com/palantir/tslint) - linter for typescript.

![tslint](real-world-samples/tslint-without-node_modules.png)
