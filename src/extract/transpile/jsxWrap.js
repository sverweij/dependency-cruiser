"use strict";
const tryRequire = require("./tryRequire");
const babel = tryRequire(
    "babel-core",
    require("../../../package.json").supportedTranspilers['babel-core']
);
const presetReact = tryRequire(
    "babel-preset-react",
    require("../../../package.json").supportedTranspilers['babel-preset-react']
);

exports.isAvailable = () => (Boolean(babel) && Boolean(presetReact)) !== false;

exports.transpile = pFile =>
    babel.transform(
        pFile,
        {
            presets: [
                "react"
            ]
        }
    ).code;
