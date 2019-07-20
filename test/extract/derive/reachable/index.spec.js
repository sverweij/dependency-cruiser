const expect = require("chai").expect;
const normalize = require("../../../../src/main/ruleSet/normalize");
const addReachability = require("../../../../src/extract/derive/reachable/index");

const gGraph = [
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

const gAnotatedGraphForHajoo = [
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
        value: true
      }
    ],
    dependencies: []
  }
];

describe("extract/derive/reachable/index - reachability detection", () => {
  it("does not explode when passed an empty graph & an empty rule set", () => {
    expect(addReachability([], normalize({}))).to.deep.equal([]);
  });

  it("returns the input graph when passed an empty rule set", () => {
    expect(addReachability(gGraph, normalize({}))).to.deep.equal(gGraph);
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
      addReachability(gGraph, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(gAnotatedGraphForHajoo);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { reachable: true }
        }
      ]
    };
    const lAnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "not-in-allowed",
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
            asDefinedInRule: "not-in-allowed",
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
            asDefinedInRule: "not-in-allowed",
            value: true
          }
        ],
        dependencies: []
      }
    ];

    expect(
      addReachability(gGraph, normalize(lForbiddenReachabilityRuleSetHajoo))
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
      addReachability(gGraph, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(gAnotatedGraphForHajoo);
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
            value: true
          }
        ],
        dependencies: []
      }
    ];

    expect(
      addReachability(gGraph, normalize(lForbiddenReachabilityRuleSetHajoo))
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
      addReachability(gGraph, normalize(lForbiddenReachabilityRuleSetHajoo))
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
});
