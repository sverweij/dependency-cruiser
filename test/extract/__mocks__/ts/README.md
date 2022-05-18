Stuff in this fixture folder is valid TypeScript. To transpile it you'll
need to pass the --allowJs parameter, because (for testing purposes) we
use a mix of typescript and javascript.

```sh
tsc --allowJs test/extract/fixtures/ts/index.ts
```

To run it,
```sh
node test/extract/fixtures/ts/index.js
```

The output will be something like:
```
1.0.0-exportedonly, 8 === 8 :
```
