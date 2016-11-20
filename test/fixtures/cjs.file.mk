[
  {
    "source": "test/fixtures/cjs/root_one.js",
    "dependencies": [
      {
        "module": "./one_only_one",
        "resolved": "test/fixtures/cjs/one_only_one.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      },
      {
        "module": "./one_only_two",
        "resolved": "test/fixtures/cjs/one_only_two.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      },
      {
        "module": "./shared",
        "resolved": "test/fixtures/cjs/shared.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      },
      {
        "module": "./sub/dir",
        "resolved": "test/fixtures/cjs/sub/dir.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      },
      {
        "module": "fs",
        "resolved": "fs",
        "moduleSystem": "cjs",
        "coreModule": true,
        "followable": false,
        "valid": true
      },
      {
        "module": "somemodule",
        "resolved": "test/fixtures/cjs/node_modules/somemodule/src/somemodule.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/one_only_one.js",
    "dependencies": [
      {
        "module": "path",
        "resolved": "path",
        "moduleSystem": "cjs",
        "coreModule": true,
        "followable": false,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/one_only_two.js",
    "dependencies": [
      {
        "module": "path",
        "resolved": "path",
        "moduleSystem": "cjs",
        "coreModule": true,
        "followable": false,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/shared.js",
    "dependencies": [
      {
        "module": "path",
        "resolved": "path",
        "moduleSystem": "cjs",
        "coreModule": true,
        "followable": false,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/sub/dir.js",
    "dependencies": [
      {
        "module": "./depindir",
        "resolved": "test/fixtures/cjs/sub/depindir.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      },
      {
        "module": "path",
        "resolved": "path",
        "moduleSystem": "cjs",
        "coreModule": true,
        "followable": false,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/sub/depindir.js",
    "dependencies": [
      {
        "module": "path",
        "resolved": "path",
        "moduleSystem": "cjs",
        "coreModule": true,
        "followable": false,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/node_modules/somemodule/src/somemodule.js",
    "dependencies": [
      {
        "module": "./moar-javascript",
        "resolved": "test/fixtures/cjs/node_modules/somemodule/src/moar-javascript.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      },
      {
        "module": "someothermodule",
        "resolved": "test/fixtures/cjs/node_modules/somemodule/node_modules/someothermodule/main.js",
        "moduleSystem": "cjs",
        "coreModule": false,
        "followable": true,
        "valid": true
      }
    ]
  },
  {
    "source": "test/fixtures/cjs/node_modules/somemodule/src/moar-javascript.js",
    "dependencies": []
  },
  {
    "source": "test/fixtures/cjs/node_modules/somemodule/node_modules/someothermodule/main.js",
    "dependencies": []
  }
]