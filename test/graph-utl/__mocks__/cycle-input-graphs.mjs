export default {
  A_B: [
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
          resolved: "d",
        },
      ],
    },
    {
      source: "e",
      dependencies: [
        {
          resolved: "d",
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
        },
      ],
    },
    {
      source: "r",
      dependencies: [
        {
          resolved: "s",
        },
      ],
    },
    {
      source: "s",
      dependencies: [
        {
          resolved: "q",
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
        },
        {
          resolved: "v",
        },
      ],
    },
    {
      source: "u",
      dependencies: [
        {
          resolved: "t",
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
      source: "a",
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
};
