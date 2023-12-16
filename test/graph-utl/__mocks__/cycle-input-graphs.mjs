export default {
  A_B: [
    {
      source: "a",
      dependencies: [
        {
          resolved: "b",
          dependencyTypes: ["npm"],
        },
      ],
    },
    {
      source: "b",
      dependencies: [],
    },
  ],
  C_C: [
    {
      source: "c",
      dependencies: [
        {
          resolved: "c",
        },
      ],
    },
  ],
  D_E_D: [
    {
      source: "d",
      dependencies: [
        {
          resolved: "e",
          exoticallyRequired: false,
          moduleSystem: "es6",
          dependencyTypes: [
            "aliased",
            "aliased-subpath-import",
            "local",
            "import",
          ],
        },
      ],
    },
    {
      source: "e",
      dependencies: [
        {
          resolved: "d",
          exoticallyRequired: false,
          moduleSystem: "es6",
          dependencyTypes: ["local", "import"],
        },
      ],
    },
  ],
  Q_R_S_Q: [
    {
      source: "q",
      dependencies: [
        {
          resolved: "r",
          dependencyTypes: ["local"],
        },
      ],
    },
    {
      source: "r",
      dependencies: [
        {
          resolved: "s",
          dependencyTypes: ["local"],
        },
      ],
    },
    {
      source: "s",
      dependencies: [
        {
          resolved: "q",
          dependencyTypes: ["local"],
        },
      ],
    },
  ],
  T_U_T_V: [
    {
      source: "t",
      dependencies: [
        {
          resolved: "u",
          dependencyTypes: ["local"],
        },
        {
          resolved: "v",
          dependencyTypes: ["npm"],
        },
      ],
    },
    {
      source: "u",
      dependencies: [
        {
          resolved: "t",
          dependencyTypes: ["local"],
        },
      ],
    },
    {
      source: "v",
      dependencies: [],
    },
  ],
  TWO_CIRCLES: [
    {
      source: "a",
      dependencies: [
        {
          resolved: "b",
        },
        {
          resolved: "d",
        },
      ],
    },
    {
      source: "b",
      dependencies: [
        {
          resolved: "c",
        },
      ],
    },
    {
      source: "c",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
    {
      source: "d",
      dependencies: [
        {
          resolved: "e",
        },
      ],
    },
    {
      source: "e",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
  ],
  TO_A_CIRCLE: [
    {
      source: "z",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
    {
      source: "a",
      dependencies: [
        {
          resolved: "b",
        },
      ],
    },
    {
      source: "b",
      dependencies: [
        {
          resolved: "c",
        },
      ],
    },
    {
      source: "c",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
  ],
  TO_A_CIRCLE_AND_IN_IT: [
    {
      source: "z",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
    {
      source: "a",
      dependencies: [
        {
          resolved: "b",
        },
      ],
    },
    {
      source: "b",
      dependencies: [
        {
          resolved: "c",
        },
      ],
    },
    {
      source: "c",
      dependencies: [
        {
          resolved: "a",
        },
        {
          resolved: "z",
        },
      ],
    },
  ],
  FLOWER: [
    {
      source: "a",
      dependencies: [
        {
          resolved: "b",
        },
        {
          resolved: "c",
        },
      ],
    },
    {
      source: "b",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
    {
      source: "c",
      dependencies: [
        {
          resolved: "a",
        },
      ],
    },
  ],
};
