const expect = require("chai").expect;
const normalize = require("../../../../src/main/rule-set/normalize");
const addReachability = require("../../../../src/extract/derive/reachable/index");
const clearCaches = require("../../../../src/extract/clear-caches");

const GRAPH = [
  {
    source: "./src/index.js",
    dependencies: [
      {
        resolved: "./src/intermediate.js"
      }
    ]
  },
  {
    source: "./src/intermediate.js",
    dependencies: [
      {
        resolved: "./src/index.js"
      },
      {
        resolved: "./src/hajoo.js"
      }
    ]
  },
  {
    source: "./src/hajoo.js",
    dependencies: []
  }
];

const GRAPH_TWO = [
  {
    source: "./src/index.js",
    dependencies: [
      {
        resolved: "./src/intermediate.js"
      },
      {
        resolved: "./src/hajee.js"
      }
    ]
  },
  {
    source: "./src/intermediate.js",
    dependencies: [
      {
        resolved: "./src/index.js"
      },
      {
        resolved: "./src/hajoo.js"
      }
    ]
  },
  {
    source: "./src/hajoo.js",
    dependencies: []
  },
  {
    source: "./src/hajee.js",
    dependencies: []
  }
];
const ANOTATED_GRAPH_FOR_HAJOO = [
  {
    source: "./src/index.js",
    reachable: [
      {
        asDefinedInRule: "unnamed",
        value: false
      }
    ],
    dependencies: [
      {
        resolved: "./src/intermediate.js"
      }
    ]
  },
  {
    source: "./src/intermediate.js",
    reachable: [
      {
        asDefinedInRule: "unnamed",
        value: false
      }
    ],
    dependencies: [
      {
        resolved: "./src/index.js"
      },
      {
        resolved: "./src/hajoo.js"
      }
    ]
  },
  {
    source: "./src/hajoo.js",
    reachable: [
      {
        asDefinedInRule: "unnamed",
        value: false
      }
    ],
    dependencies: []
  }
];

describe("extract/derive/reachable/index - reachability detection", () => {
  beforeEach(() => {
    clearCaches();
  });
  it("does not explode when passed an empty graph & an empty rule set", () => {
    expect(addReachability([], normalize({}))).to.deep.equal([]);
  });

  it("returns the input graph when passed an empty rule set", () => {
    expect(addReachability(GRAPH, normalize({}))).to.deep.equal(GRAPH);
  });

  it('returns the reachability annotated graph when a rule set with forbidden "reachable" in it', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { reachable: false }
        }
      ]
    };

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(ANOTATED_GRAPH_FOR_HAJOO);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (with a rule name)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          name: "hajoo-not-reachable-from-src",
          from: { path: "src/[^.]+\\.js" },
          to: { path: "./src/hajoo\\.js$", reachable: true }
        }
      ]
    };
    const lAnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ],
        reaches: [
          {
            asDefinedInRule: "hajoo-not-reachable-from-src",
            modules: [
              {
                source: "./src/hajoo.js",
                via: [
                  "./src/index.js",
                  "./src/intermediate.js",
                  "./src/hajoo.js"
                ]
              }
            ]
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ],
        reaches: [
          {
            asDefinedInRule: "hajoo-not-reachable-from-src",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"]
              }
            ]
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "hajoo-not-reachable-from-src"
          }
        ]
      }
    ];
    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnotatedGraphForHajooAllowed);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (without a rule name)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/[^.]+\\.js" },
          to: { path: "./src/hajoo\\.js$", reachable: true }
        }
      ]
    };
    const lAnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: [
                  "./src/index.js",
                  "./src/intermediate.js",
                  "./src/hajoo.js"
                ]
              }
            ]
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"]
              }
            ]
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "not-in-allowed"
          }
        ]
      }
    ];
    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnotatedGraphForHajooAllowed);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (without a rule name - multiple matches)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/[^.]+\\.js" },
          to: { path: "./src/haj[^.]+\\.js$", reachable: true }
        }
      ]
    };
    const lAnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          },
          {
            resolved: "./src/hajee.js"
          }
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: [
                  "./src/index.js",
                  "./src/intermediate.js",
                  "./src/hajoo.js"
                ]
              },
              {
                source: "./src/hajee.js",
                via: ["./src/index.js", "./src/hajee.js"]
              }
            ]
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"]
              },
              {
                source: "./src/hajee.js",
                via: [
                  "./src/intermediate.js",
                  "./src/index.js",
                  "./src/hajee.js"
                ]
              }
            ]
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "not-in-allowed"
          }
        ]
      },
      {
        source: "./src/hajee.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "not-in-allowed"
          }
        ]
      }
    ];
    expect(
      addReachability(GRAPH_TWO, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnotatedGraphForHajooAllowed);
  });

  // eslint-disable-next-line max-len
  it('returns the reachability annotated graph when passed a rule set with forbidden "reachable" in it (and a pathNot from)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { pathNot: "intermediate|index" },
          to: { reachable: false }
        }
      ]
    };

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(ANOTATED_GRAPH_FOR_HAJOO);
  });

  it('returns the reachability annotated graph when with forbidden "reachable" in it that has a pathNot', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { pathNot: "intermediate", reachable: false }
        }
      ]
    };
    const lAnotatedGraphForHajooNoIntermediate = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "unnamed",
            value: false
          }
        ],
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        reachable: [
          {
            asDefinedInRule: "unnamed",
            value: false
          }
        ],
        dependencies: []
      }
    ];

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnotatedGraphForHajooNoIntermediate);
  });

  it('returns the reachability annotated graph when with forbidden "reachable" in it that has a path', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { path: "intermediate", reachable: false }
        }
      ]
    };
    const lAnotatedGraphForHajooNoIntermediate = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        reachable: [
          {
            asDefinedInRule: "unnamed",
            value: false
          }
        ],
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: []
      }
    ];

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnotatedGraphForHajooNoIntermediate);
  });

  it("clubs together reachability from the same rule", () => {
    const lSourceGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: []
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          }
        ]
      }
    ];
    const lPoorMansTestCoverageRule = {
      forbidden: [
        {
          name: "not-unreachable-by-test",
          from: {
            path: "\\.spec\\.js$"
          },
          to: {
            path: "src",
            reachable: false
          }
        }
      ]
    };
    const lResultGraph = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            value: true
          }
        ],
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            value: true
          }
        ],
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            value: true
          }
        ],
        dependencies: []
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          }
        ]
      }
    ];

    expect(
      addReachability(lSourceGraph, normalize(lPoorMansTestCoverageRule))
    ).to.deep.equal(lResultGraph);
  });

  it("leaves reachability on the same object, but from the another rule alone", () => {
    const lSourceGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: []
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          }
        ]
      }
    ];
    const lTwoDifferentRules = {
      forbidden: [
        {
          name: "not-unreachable-by-test",
          from: {
            path: "\\.spec\\.js$"
          },
          to: {
            path: "src",
            reachable: false
          }
        },
        {
          name: "not-reachable-from-index",
          from: {
            path: "\\./src/index\\.js$"
          },
          to: {
            path: "\\./src/hajoo\\.js$",
            reachable: false
          }
        }
      ]
    };
    const lResultGraph = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            value: true
          }
        ],
        dependencies: [
          {
            resolved: "./src/intermediate.js"
          }
        ]
      },
      {
        source: "./src/intermediate.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            value: true
          }
        ],
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            value: true
          },
          {
            asDefinedInRule: "not-reachable-from-index",
            value: true
          }
        ],
        dependencies: []
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          }
        ]
      }
    ];

    expect(
      addReachability(lSourceGraph, normalize(lTwoDifferentRules))
    ).to.deep.equal(lResultGraph);
  });

  it("leaves reaches on the same object, but from the another rule alone", () => {
    const lSourceGraph = [
      {
        source: "./src/index.js"
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          },
          {
            resolved: "./src/hajoo.js"
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: []
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js"
          }
        ]
      }
    ];
    const lTwoDifferentRules = {
      forbidden: [
        {
          name: "dont-touch-index",
          from: {
            path: "intermediate\\.js$"
          },
          to: {
            path: "\\./src/index\\.js$",
            reachable: true
          }
        },
        {
          name: "dont-touch-hajoo",
          from: {
            path: "intermediate\\.js$"
          },
          to: {
            path: "\\./src/hajoo\\.js$",
            reachable: true
          }
        }
      ]
    };
    const lResultGraph = [
      {
        source: "./src/index.js",
        reachable: [{ value: true, asDefinedInRule: "dont-touch-index" }]
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          { resolved: "./src/index.js" },
          { resolved: "./src/hajoo.js" }
        ],
        reaches: [
          {
            asDefinedInRule: "dont-touch-index",
            modules: [
              {
                source: "./src/index.js",
                via: ["./src/intermediate.js", "./src/index.js"]
              }
            ]
          },
          {
            asDefinedInRule: "dont-touch-hajoo",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"]
              }
            ]
          }
        ]
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [{ value: true, asDefinedInRule: "dont-touch-hajoo" }]
      },
      {
        source: "./test/index.spec.js",
        dependencies: [{ resolved: "./src/index.js" }]
      }
    ];
    expect(
      addReachability(lSourceGraph, normalize(lTwoDifferentRules))
    ).to.deep.equal(lResultGraph);
  });
});
