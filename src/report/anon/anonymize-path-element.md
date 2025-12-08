### anonymizePathElement algorithm notes

`anonymizePathElement` replaces the passed path element with words from the word list:
- If the word list is empty use a ('smart') random string (see
  randomString)
- ... but don't replace if the pPathElement matches the whitelist
- and only replace up until the first dot in the pattern, so
  extensions get

Examples:

```
superSecureThing.ts => abandon.ts
superSecureThing.spec.ts => abandon.spec.ts
src/index.ts => src/index.ts // 'src' and 'index' are in the whitelist
lib/somethingElse.service.js => lib/ability.service.js
```

To make sure the same input value gets the same output on
consecutive calls, this function saves the (path element, result)
pairs in a cache. If you don't want that pass false to the pCached
parameter

[!NOTE] The function _removes_ elements from pWordList to prevent duplicates,
so if the word list is precious to you - pass a clone)