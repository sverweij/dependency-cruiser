import { deepEqual } from "node:assert/strict";
import normalize from "#main/rule-set/normalize.mjs";
import addReachability from "#enrich/derive/reachable.mjs";
import clearExtractCaches from "#extract/clear-caches.mjs";

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
    deepEqual(addReachability([], normalize({})), []);
  });

  it("returns the input graph when passed an empty rule set", () => {
    deepEqual(addReachability(GRAPH, normalize({})), GRAPH);
  });

  it("returns the input graph when passed a rule set with only a rul that doesn't have a 'from' or a 'module'", () => {
    deepEqual(
      addReachability(
        GRAPH,
        normalize({ required: [{ thing: {}, to: { reachable: true } }] }),
      ),
      GRAPH,
    );
  });

  it('returns the reachability annotated graph when a rule set with forbidden "reachable" in it (forbidden rule)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      forbidden: [
        {
          from: { path: "src/hajoo\\.js" },
          to: { reachable: false },
        },
      ],
    };

    deepEqual(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo)),
      ANNOTATED_GRAPH_FOR_HAJOO,
    );
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it (with a rule name)', () => {
    const lForbiddenReachabilityRuleSetHajoo = {
      allowed: [
        {
          from: { path: "src/[^.]+[.]js" },
          to: { path: "./src/hajoo[.]js$", reachable: true },
        },
      ],
    };
    const lExpected = [
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
                  { name: "./src/intermediate.js", dependencyTypes: [] },
                  { name: "./src/hajoo.js", dependencyTypes: [] },
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
                via: [{ name: "./src/hajoo.js", dependencyTypes: [] }],
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
    deepEqual(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo)),
      lExpected,
    );
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
    const lExpected = [
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
                  { name: "./src/intermediate.js", dependencyTypes: [] },
                  { name: "./src/hajoo.js", dependencyTypes: [] },
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
                via: [{ name: "./src/hajoo.js", dependencyTypes: [] }],
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
    deepEqual(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo)),
      lExpected,
    );
  });

  it('returns the reachability annotated graph when a rule set with allowed "reachable" in it ("required" rules)', () => {
    const lRequiredReachabilityRuleSetHajoo = {
      required: [
        {
          name: "must-reach-hajoo-somehow",
          module: { path: "src/[^.]+[.]js" },
          to: { path: "./src/hajoo[.]js$", reachable: true },
        },
      ],
    };
    const lExpected = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
        reaches: [
          {
            asDefinedInRule: "must-reach-hajoo-somehow",
            modules: [
              {
                source: "./src/hajoo.js",
                via: [
                  { name: "./src/intermediate.js", dependencyTypes: [] },
                  { name: "./src/hajoo.js", dependencyTypes: [] },
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
            asDefinedInRule: "must-reach-hajoo-somehow",
            modules: [
              {
                source: "./src/hajoo.js",
                via: [{ name: "./src/hajoo.js", dependencyTypes: [] }],
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
            asDefinedInRule: "must-reach-hajoo-somehow",
          },
        ],
      },
    ];
    const lNormalizedGraph = normalize(lRequiredReachabilityRuleSetHajoo);
    const lResult = addReachability(GRAPH, lNormalizedGraph);
    deepEqual(lResult, lExpected);
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
    const lExpected = [
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
                  { name: "./src/intermediate.js", dependencyTypes: [] },
                  { name: "./src/hajoo.js", dependencyTypes: [] },
                ],
              },
              {
                source: "./src/hajee.js",
                via: [{ name: "./src/hajee.js", dependencyTypes: [] }],
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
                via: [{ name: "./src/hajoo.js", dependencyTypes: [] }],
              },
              {
                source: "./src/hajee.js",
                via: [
                  { name: "./src/index.js", dependencyTypes: [] },
                  { name: "./src/hajee.js", dependencyTypes: [] },
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
    deepEqual(
      addReachability(GRAPH_TWO, normalize(lForbiddenReachabilityRuleSetHajoo)),
      lExpected,
    );
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

    deepEqual(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo)),
      ANNOTATED_GRAPH_FOR_HAJOO,
    );
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

    deepEqual(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo)),
      lAnnotatedGraphForHajooNoIntermediate,
    );
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

    deepEqual(
      addReachability(GRAPH, normalize(lForbiddenReachabilityRuleSetHajoo)),
      lAnnotatedGraphForHajooNoIntermediate,
    );
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

    deepEqual(
      addReachability(lSourceGraph, normalize(lPoorMansTestCoverageRule)),
      lResultGraph,
    );
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

    deepEqual(
      addReachability(lSourceGraph, normalize(lTwoDifferentRules)),
      lResultGraph,
    );
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
                via: [{ name: "./src/index.js", dependencyTypes: [] }],
              },
            ],
          },
          {
            asDefinedInRule: "dont-touch-hajoo",
            modules: [
              {
                source: "./src/hajoo.js",
                via: [{ name: "./src/hajoo.js", dependencyTypes: [] }],
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
    deepEqual(
      addReachability(lSourceGraph, normalize(lTwoDifferentRules)),
      lResultGraph,
    );
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
    deepEqual(
      addReachability(lDependencyGraph, normalize(lRuleSetWithCaptureGroup)),
      lExpectedGraph,
    );
  });
});
