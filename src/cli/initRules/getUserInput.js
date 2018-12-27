const inquirer = require('inquirer');

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
                name: "recommended",
                value: "dependency-cruiser/configs/recommended"
            },
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
    }
];

module.exports = () => inquirer.prompt(INQUIRER_QUESTIONS);
