export default {
  modules: [
    {
      source: "node_modules/somemodule/node_modules/someothermodule/main.js",
      dependencies: [],
    },
    {
      source: "node_modules/somemodule/src/moar-javascript.js",
      dependencies: [],
    },
    {
      source: "node_modules/somemodule/src/somemodule.js",
      dependencies: [
        {
          module: "./moar-javascript",
          resolved: "node_modules/somemodule/src/moar-javascript.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "someothermodule",
          resolved:
            "node_modules/somemodule/node_modules/someothermodule/main.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "one_only_one.js",
      dependencies: [
        {
          module: "path",
          resolved: "path",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "path",
      followable: false,
      coreModule: true,
      dependencies: [],
    },
    {
      source: "one_only_two.js",
      dependencies: [
        {
          module: "path",
          resolved: "path",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "root_one.js",
      dependencies: [
        {
          module: "./one_only_one",
          resolved: "one_only_one.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "./one_only_two",
          resolved: "one_only_two.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "./shared",
          resolved: "shared.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "./sub/dir",
          resolved: "sub/dir.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "fs",
          resolved: "fs",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "somemodule",
          resolved: "node_modules/somemodule/src/somemodule.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "fs",
      followable: false,
      coreModule: true,
      dependencies: [],
    },
    {
      source: "shared.js",
      couldNotResolve: true,
      dependencies: [
        {
          module: "path",
          resolved: "path",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "sub/dir.js",
      dependencies: [
        {
          module: "./depindir",
          resolved: "sub/depindir.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "path",
          resolved: "path",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "sub/depindir.js",
      dependencies: [
        {
          module: "path",
          resolved: "path",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "root_two.js",
      dependencies: [
        {
          module: "./shared",
          resolved: "shared.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "./somedata.json",
          resolved: "somedata.json",
          moduleSystem: "cjs",
          coreModule: false,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "./two_only_one",
          resolved: "two_only_one.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
        {
          module: "http",
          resolved: "http",
          moduleSystem: "cjs",
          coreModule: true,
          followable: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
    {
      source: "somedata.json",
      followable: false,
      coreModule: false,
      dependencies: [],
    },
    {
      source: "http",
      followable: false,
      coreModule: true,
      dependencies: [],
    },
    {
      source: "two_only_one.js",
      dependencies: [
        {
          module: "./sub/dir",
          resolved: "sub/dir.js",
          moduleSystem: "cjs",
          coreModule: false,
          followable: true,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "unnamed",
            },
          ],
        },
      ],
    },
  ],
  summary: {
    violations: [
      {
        from: "aap",
        to: "noot",
        rule: {
          name: "no-leesplank",
          severity: "error",
        },
      },
      {
        from: "aap",
        to: "noot",
        rule: {
          name: "no-schaap",
          severity: "error",
        },
      },
    ],
    error: 2,
    warn: 0,
    info: 0,
    totalCruised: 33,
    totalDependenciesCruised: 333,
    ruleSetUsed: {
      forbidden: [
        {
          name: "no-leesplank",
          comment: "comment to no-leesplank",
          from: {
            path: "^aap$",
          },
          to: {
            path: "^noot$",
          },
        },
      ],
    },
  },
};
