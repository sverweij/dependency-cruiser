## getCachedRegExp

in [`./regex-util.mjs`](./regex-util.mjs)
 
### Why cache?

Regular expression compilation is pretty fast, and the caching mechanism adds
some overhead, but when a pattern is used _really_ often, the trade-off
is worth it. With our RRE's that's the case - e.g. on dependency-cruiser's
self-scan the RegExp's are used ~64000x and there's ~60 unique RE's, making
for a great cache utilization ratio.

### Cache management

There's no eviction policy, or max size at the moment. The number of unique patterns
is limited to what is in dependency-cruiser configurations (in rules and in some 
of the options) and is hence not expected to get very large.

We can add measures when either of that changes.

There _is_ a clearRegExpCache that'll clear the Map - called in the main
`cruise` function just after creating the report and before returning
it (as at least one reporter uses the cache as well). It's the polite thing
to do, but for normal command line use it likely doesn't matter too much (a few
moments later the program will terminate anyway).