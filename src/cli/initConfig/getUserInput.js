const inquirer     = require('inquirer');
const $defaults    = require('../defaults.json');
const {fileExists, pnpIsEnabled} = require('./helpers');


const TYPESCRIPT_CONFIG = `./${$defaults.TYPESCRIPT_CONFIG}`;
const WEBPACK_CONFIG    = `./${$defaults.WEBPACK_CONFIG}`;

const INQUIRER_QUESTIONS = [
    {
        name: "configFormat",
        type: "list",
        message: "What format do you want your config file to be in?",
        choices: [
            {
                name: "JSON",
                value: ".json"
            },
            {
                name: "JavaScript",
                value: ".js"
            }
        ]
    },
    {
        name: "configType",
        type: "list",
        message: "Do you want to use a preset or a self-contained configuration?",
        choices: ["self-contained", "preset"]
    },
    {
        name: "preset",
        type: "list",
        message: "Pick a preset",
        choices: [
            {
                name: "recommended, warn only (good starter choice)",
                value: "dependency-cruiser/configs/recommended-warn-only"
            },
            {
                name: "recommended, strict ",
                value:"dependency-cruiser/configs/recommended-strict"
            }
        ],
        default: "dependency-cruiser/configs/recommended-warn-only",
        when: pAnswers => pAnswers.configType === "preset"
    },
    {
        name: "useYarnPnP",
        type: "confirm",
        message: "You seem to be using yarn Plug'n'Play. Take that into account?",
        default: true,
        when: () => pnpIsEnabled()
    },
    {
        name: "useTsConfig",
        type: "confirm",
        message: "Looks like you're using TypeScript. Use a 'tsconfig.json'?",
        default: true,
        when: () => fileExists(TYPESCRIPT_CONFIG)
    },
    {
        name: "tsConfig",
        type: "input",
        message: "Full path to 'tsconfig.json':",
        default: TYPESCRIPT_CONFIG,
        validate: (pInput) => fileExists(pInput) || `hmm, '${pInput}' doesn't seem to exist - try again?`,
        when: (pAnswers) => pAnswers.useTsConfig
    },
    {
        name: "useWebpackConfig",
        type: "confirm",
        message: "Looks like you're using webpack - specify a webpack config?",
        default: true,
        when: () => fileExists(WEBPACK_CONFIG)
    },
    {
        name: "webpackConfig",
        type: "input",
        message: "Full path to webpack config:",
        default: WEBPACK_CONFIG,
        validate: (pInput) => fileExists(pInput) || `hmm, '${pInput}' doesn't seem to exist - try again?`,
        when: (pAnswers) => pAnswers.useWebpackConfig
    }
];

module.exports = () => inquirer.prompt(INQUIRER_QUESTIONS);
