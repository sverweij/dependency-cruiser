"use strict";
const tryRequire = require("./tryRequire");
const babel = tryRequire(
    "babel-core",
    require("../../../package.json").supportedTranspilers['babel-core']
);
const presetReact = tryRequire(
    "babel-plugin-transform-react-jsx",
    require("../../../package.json").supportedTranspilers['babel-plugin-transform-react-jsx']
);

exports.isAvailable = () => (Boolean(babel) && Boolean(presetReact)) !== false;

exports.transpile = pFile =>
    babel.transform(
        pFile,
        {
            plugins: [
                "transform-react-jsx"
            ]
        }
    ).code;
