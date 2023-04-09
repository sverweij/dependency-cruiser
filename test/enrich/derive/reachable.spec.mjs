import { expect } from "chai";
import normalize from "../../../src/main/rule-set/normalize.mjs";
import addReachability from "../../../src/enrich/derive/reachable.mjs";
import clearExtractCaches from "../../../src/extract/clear-caches.mjs";

const GRAPH = [
  {
    source: "./src/index.js",
    dependencies: [
      {
        resolved: "./src/intermediate.js",
      },
    ],
  },
  {
    source: "./src/intermediate.js",
    dependencies: [
      {
        resolved: "./src/index.js",
      },
      {
        resolved: "./src/hajoo.js",
      },
    ],
  },
  {
    source: "./src/hajoo.js",
    dependencies: [],
  },
];

const GRAPH_TWO = [
  {
    source: "./src/index.js",
    dependencies: [
      {
        resolved: "./src/intermediate.js",
      },
      {
        resolved: "./src/hajee.js",
      },
    ],
  },
  {
    source: "./src/intermediate.js",
    dependencies: [
      {
        resolved: "./src/index.js",
      },
      {
        resolved: "./src/hajoo.js",
      },
    ],
  },
  {
    source: "./src/hajoo.js",
    dependencies: [],
  },
  {
    source: "./src/hajee.js",
    dependencies: [],
  },
];
const ANNOTATED_GRAPH_FOR_HAJOO = [
  {
    source: "./src/index.js",
    reachable: [
      {
        asDefinedInRule: "unnamed",
        matchedFrom: "./src/hajoo.js",
        value: false,
      },
    ],
    dependencies: [
      {
        resolved: "./src/intermediate.js",
      },
    ],
  },
  {
    source: "./src/intermediate.js",
    reachable: [
      {
        asDefinedInRule: "unnamed",
        matchedFrom: "./src/hajoo.js",
        value: false,
      },
    ],
    dependencies: [
      {
        resolved: "./src/index.js",
      },
      {
        resolved: "./src/hajoo.js",
      },
    ],
  },
  {
    source: "./src/hajoo.js",
    dependencies: [],
  },
];

describe("[U] enrich/derive/reachable/index - reachability detection", () => {
  beforeEach(() => {
    clearExtractCaches();
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
          to: { reachable: false },
        },
      ],
    };

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(ANNOTATED_GRAPH_FOR_HAJOO);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (with a rule name)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/[^.]+\\.js" },
          to: { path: "./src/hajoo\\.js$", reachable: true },
        },
      ],
    };
    const lAnnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
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
                  "./src/hajoo.js",
                ],
              },
            ],
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"],
              },
            ],
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            matchedFrom: "./src/index.js",
            asDefinedInRule: "not-in-allowed",
          },
        ],
      },
    ];
    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnnotatedGraphForHajooAllowed);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (without a rule name)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/[^.]+\\.js" },
          to: { path: "./src/hajoo\\.js$", reachable: true },
        },
      ],
    };
    const lAnnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
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
                  "./src/hajoo.js",
                ],
              },
            ],
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"],
              },
            ],
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            matchedFrom: "./src/index.js",
            asDefinedInRule: "not-in-allowed",
          },
        ],
      },
    ];
    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnnotatedGraphForHajooAllowed);
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (without a rule name - multiple matches)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/[^.]+\\.js" },
          to: { path: "./src/haj[^.]+\\.js$", reachable: true },
        },
      ],
    };
    const lAnnotatedGraphForHajooAllowed = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
          {
            resolved: "./src/hajee.js",
          },
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
                  "./src/hajoo.js",
                ],
              },
              {
                source: "./src/hajee.js",
                via: ["./src/index.js", "./src/hajee.js"],
              },
            ],
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
        reaches: [
          {
            asDefinedInRule: "not-in-allowed",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"],
              },
              {
                source: "./src/hajee.js",
                via: [
                  "./src/intermediate.js",
                  "./src/index.js",
                  "./src/hajee.js",
                ],
              },
            ],
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            matchedFrom: "./src/index.js",
            asDefinedInRule: "not-in-allowed",
          },
        ],
      },
      {
        source: "./src/hajee.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            matchedFrom: "./src/index.js",
            asDefinedInRule: "not-in-allowed",
          },
        ],
      },
    ];
    expect(
      addReachability(GRAPH_TWO, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnnotatedGraphForHajooAllowed);
  });

  it('returns the reachability annotated graph when passed a rule set with forbidden "reachable" in it (and a pathNot from)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { pathNot: "intermediate|index" },
          to: { reachable: false },
        },
      ],
    };

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(ANNOTATED_GRAPH_FOR_HAJOO);
  });

  it('returns the reachability annotated graph when with forbidden "reachable" in it that has a pathNot', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { pathNot: "intermediate", reachable: false },
        },
      ],
    };
    const lAnnotatedGraphForHajooNoIntermediate = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "unnamed",
            matchedFrom: "./src/hajoo.js",
            value: false,
          },
        ],
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
    ];

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnnotatedGraphForHajooNoIntermediate);
  });

  it('returns the reachability annotated graph when with forbidden "reachable" in it that has a path', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { path: "intermediate", reachable: false },
        },
      ],
    };
    const lAnnotatedGraphForHajooNoIntermediate = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        reachable: [
          {
            asDefinedInRule: "unnamed",
            matchedFrom: "./src/hajoo.js",
            value: false,
          },
        ],
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
    ];

    expect(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo))
    ).to.deep.equal(lAnnotatedGraphForHajooNoIntermediate);
  });

  it("clubs together reachability from the same rule", () => {
    const lSourceGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
    ];
    const lPoorMansTestCoverageRule = {
      forbidden: [
        {
          name: "not-unreachable-by-test",
          from: {
            path: "\\.spec\\.js$",
          },
          to: {
            path: "src",
            reachable: false,
          },
        },
      ],
    };
    const lResultGraph = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            matchedFrom: "./test/hajoo.spec.js",
            value: true,
          },
        ],
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            matchedFrom: "./test/hajoo.spec.js",
            value: true,
          },
        ],
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            matchedFrom: "./test/hajoo.spec.js",
            value: true,
          },
        ],
        dependencies: [],
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
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
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
    ];
    const lTwoDifferentRules = {
      forbidden: [
        {
          name: "not-unreachable-by-test",
          from: {
            path: "\\.spec\\.js$",
          },
          to: {
            path: "src",
            reachable: false,
          },
        },
        {
          name: "not-reachable-from-index",
          from: {
            path: "\\./src/index\\.js$",
          },
          to: {
            path: "\\./src/hajoo\\.js$",
            reachable: false,
          },
        },
      ],
    };
    const lResultGraph = [
      {
        source: "./src/index.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            matchedFrom: "./test/hajoo.spec.js",
            value: true,
          },
        ],
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            matchedFrom: "./test/hajoo.spec.js",
            value: true,
          },
        ],
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        reachable: [
          {
            asDefinedInRule: "not-unreachable-by-test",
            matchedFrom: "./test/hajoo.spec.js",
            value: true,
          },
          {
            asDefinedInRule: "not-reachable-from-index",
            matchedFrom: "./src/index.js",
            value: true,
          },
        ],
        dependencies: [],
      },
      {
        source: "./test/hajoo.spec.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
    ];

    expect(
      addReachability(lSourceGraph, normalize(lTwoDifferentRules))
    ).to.deep.equal(lResultGraph);
  });

  it("leaves reaches on the same object, but from the another rule alone", () => {
    const lSourceGraph = [
      {
        source: "./src/index.js",
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
      {
        source: "./test/index.spec.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
    ];
    const lTwoDifferentRules = {
      forbidden: [
        {
          name: "dont-touch-index",
          from: {
            path: "intermediate\\.js$",
          },
          to: {
            path: "\\./src/index\\.js$",
            reachable: true,
          },
        },
        {
          name: "dont-touch-hajoo",
          from: {
            path: "intermediate\\.js$",
          },
          to: {
            path: "\\./src/hajoo\\.js$",
            reachable: true,
          },
        },
      ],
    };
    const lResultGraph = [
      {
        source: "./src/index.js",
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          { resolved: "./src/index.js" },
          { resolved: "./src/hajoo.js" },
        ],
        reaches: [
          {
            asDefinedInRule: "dont-touch-index",
            modules: [
              {
                source: "./src/index.js",
                via: ["./src/intermediate.js", "./src/index.js"],
              },
            ],
          },
          {
            asDefinedInRule: "dont-touch-hajoo",
            modules: [
              {
                source: "./src/hajoo.js",
                via: ["./src/intermediate.js", "./src/hajoo.js"],
              },
            ],
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
      {
        source: "./test/index.spec.js",
        dependencies: [{ resolved: "./src/index.js" }],
      },
    ];
    expect(
      addReachability(lSourceGraph, normalize(lTwoDifferentRules))
    ).to.deep.equal(lResultGraph);
  });

  it("correctly processes capture groups", () => {
    const lRuleSetWithCaptureGroup = {
      forbidden: [
        {
          name: "with-a-capture-group",
          from: {
            path: "^src/([^/]+)/index\\.js$",
          },
          to: {
            path: "^src/$1",
            reachable: false,
          },
        },
      ],
    };
    const lDependencyGraph = [
      {
        source: "src/foo/index.js",
        dependencies: [{ resolved: "src/foo/quux/huey.js" }],
      },
      {
        source: "src/foo/quux/huey.js",
        dependencies: [{ resolved: "src/foo/quux/louie.js" }],
      },
      {
        source: "src/foo/quux/louie.js",
        dependencies: [{ resolved: "src/foo/quux/dewey.js" }],
      },
      {
        source: "src/foo/quux/dewey.js",
        dependencies: [],
      },
      {
        source: "src/foo/quux/not-reachable-from-foo-index.js",
        dependencies: [],
      },
      {
        source: "src/bar/index.js",
        dependencies: [{ resolved: "src/bar/ister.js" }],
      },
      {
        source: "src/bar/ister.js",
        dependencies: [
          { resolved: "src/bar/stool.js" },
          { resolved: "src/bar/iton.js" },
        ],
      },
      {
        source: "src/bar/stool.js",
        dependencies: [],
      },
      {
        source: "src/bar/iton.js",
        dependencies: [],
      },
      {
        source: "src/bar/none.js",
        dependencies: [],
      },
      {
        source: "src/baz/index.js",
        dependencies: [],
      },
    ];
    const lExpectedGraph = [
      {
        source: "src/foo/index.js",
        dependencies: [
          {
            resolved: "src/foo/quux/huey.js",
          },
        ],
      },
      {
        source: "src/foo/quux/huey.js",
        dependencies: [
          {
            resolved: "src/foo/quux/louie.js",
          },
        ],
        reachable: [
          {
            value: true,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/foo/index.js",
          },
        ],
      },
      {
        source: "src/foo/quux/louie.js",
        dependencies: [
          {
            resolved: "src/foo/quux/dewey.js",
          },
        ],
        reachable: [
          {
            value: true,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/foo/index.js",
          },
        ],
      },
      {
        source: "src/foo/quux/dewey.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/foo/index.js",
          },
        ],
      },
      {
        source: "src/foo/quux/not-reachable-from-foo-index.js",
        dependencies: [],
        reachable: [
          {
            value: false,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/foo/index.js",
          },
        ],
      },
      {
        source: "src/bar/index.js",
        dependencies: [
          {
            resolved: "src/bar/ister.js",
          },
        ],
      },
      {
        source: "src/bar/ister.js",
        dependencies: [
          {
            resolved: "src/bar/stool.js",
          },
          {
            resolved: "src/bar/iton.js",
          },
        ],
        reachable: [
          {
            value: true,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/bar/index.js",
          },
        ],
      },
      {
        source: "src/bar/stool.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/bar/index.js",
          },
        ],
      },
      {
        source: "src/bar/iton.js",
        dependencies: [],
        reachable: [
          {
            value: true,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/bar/index.js",
          },
        ],
      },
      {
        source: "src/bar/none.js",
        dependencies: [],
        reachable: [
          {
            value: false,
            asDefinedInRule: "with-a-capture-group",
            matchedFrom: "src/bar/index.js",
          },
        ],
      },
      {
        source: "src/baz/index.js",
        dependencies: [],
      },
    ];
    expect(
      addReachability(lDependencyGraph, normalize(lRuleSetWithCaptureGroup))
    ).to.deep.equal(lExpectedGraph);
  });
});
