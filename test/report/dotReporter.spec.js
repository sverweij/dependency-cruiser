"use strict";
const expect           = require('chai').expect;
const render           = require('../../src/report/dotReporter');
const deps             = require('../fixtures/cjs-no-dependency-valid.json');
const unresolvableDeps = require('../fixtures/es6-unresolvable-deps.json');

const elFixture = `digraph "dependency-cruiser output"{
    ordering=out
    rankdir=LR
    splines=true
    overlap=false
    nodesep=0.16
    fontname="Helvetica-bold"
    fontsize="9"
    style="rounded,bold"
    compound=true
    node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
    edge [color=black arrowhead=normal fontname="Helvetica" fontsize="9"]

    "fs" [color="grey" fontcolor="grey"]
    "http" [color="grey" fontcolor="grey"]
    subgraph "cluster_/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule" {label="somemodule" subgraph "cluster_/node_modules/somemodule/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule/node_modules/someothermodule" {label="someothermodule" "node_modules/somemodule/node_modules/someothermodule/main.js" [label="main.js" URL="node_modules/somemodule/node_modules/someothermodule/main.js"] } } } }
    subgraph "cluster_/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule" {label="somemodule" subgraph "cluster_/node_modules/somemodule/src" {label="src" "node_modules/somemodule/src/moar-javascript.js" [label="moar-javascript.js" URL="node_modules/somemodule/src/moar-javascript.js"] } } }
    subgraph "cluster_/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule" {label="somemodule" subgraph "cluster_/node_modules/somemodule/src" {label="src" "node_modules/somemodule/src/somemodule.js" [label="somemodule.js" URL="node_modules/somemodule/src/somemodule.js"] } } }
    "one_only_one.js" [URL="one_only_one.js"]
    "one_only_two.js" [URL="one_only_two.js"]
    "path" [color="grey" fontcolor="grey"]
    "root_one.js" [URL="root_one.js"]
    "root_two.js" [URL="root_two.js"]
    "shared.js" [color="red" fontcolor="red"]
    "somedata.json" [URL="somedata.json"]
    subgraph "cluster_/sub" {label="sub" "sub/depindir.js" [label="depindir.js" URL="sub/depindir.js"] }
    subgraph "cluster_/sub" {label="sub" "sub/dir.js" [label="dir.js" URL="sub/dir.js"] }
    "two_only_one.js" [URL="two_only_one.js"]

    "node_modules/somemodule/src/somemodule.js" -> "node_modules/somemodule/src/moar-javascript.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "node_modules/somemodule/src/somemodule.js" -> "node_modules/somemodule/node_modules/someothermodule/main.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "one_only_one.js" -> "path" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "one_only_two.js" -> "path" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_one.js" -> "one_only_one.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_one.js" -> "one_only_two.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_one.js" -> "shared.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_one.js" -> "sub/dir.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_one.js" -> "fs" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_one.js" -> "node_modules/somemodule/src/somemodule.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_two.js" -> "shared.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_two.js" -> "somedata.json" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_two.js" -> "two_only_one.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "root_two.js" -> "http" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "shared.js" -> "path" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "sub/depindir.js" -> "path" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "sub/dir.js" -> "sub/depindir.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "sub/dir.js" -> "path" [color="orange" penwidth=2.0 tooltip="unnamed"]
    "two_only_one.js" -> "sub/dir.js" [color="orange" penwidth=2.0 tooltip="unnamed"]
}
`;

const unresolvableFixture = `digraph "dependency-cruiser output"{
    ordering=out
    rankdir=LR
    splines=true
    overlap=false
    nodesep=0.16
    fontname="Helvetica-bold"
    fontsize="9"
    style="rounded,bold"
    compound=true
    node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
    edge [color=black arrowhead=normal fontname="Helvetica" fontsize="9"]

    "./not-at-home" [color="red" fontcolor="red"]
    subgraph "cluster_/." {label="." subgraph "cluster_/./this" {label="this" subgraph "cluster_/./this/path" {label="path" subgraph "cluster_/./this/path/does" {label="does" subgraph "cluster_/./this/path/does/not" {label="not" "./this/path/does/not/exist" [label="exist" color="red" fontcolor="red"] } } } } }
    subgraph "cluster_/test" {label="test" subgraph "cluster_/test/fixtures" {label="fixtures" subgraph "cluster_/test/fixtures/unresolvable-in-sub" {label="unresolvable-in-sub" "test/fixtures/unresolvable-in-sub/refers-to-an-unresolvable-module.js" [label="refers-to-an-unresolvable-module.js" URL="test/fixtures/unresolvable-in-sub/refers-to-an-unresolvable-module.js"] } } }

    "test/fixtures/unresolvable-in-sub/refers-to-an-unresolvable-module.js" -> "./not-at-home"
    "test/fixtures/unresolvable-in-sub/refers-to-an-unresolvable-module.js" -> "./this/path/does/not/exist"
}
`;

describe("dot reporter", () => {
    it("renders a dot - modules in the root don't come in a cluster", () => {
        expect(render(deps).content).to.deep.equal(elFixture);
        // console.log(render(deps));
        // expect(1).to.equal(1);
    });

    it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
        expect(render(unresolvableDeps).content).to.deep.equal(unresolvableFixture);
        // console.log(render(deps));
        // expect(1).to.equal(1);
    });

});

/* eslint max-len: 0 */
