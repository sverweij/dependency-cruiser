## Contributing

So you want to contribute to dependency-cruiser? We already love you! :heart:

To make this as easy as possible for you, here's some simple guidelines:

### FAQ

It might be a solution to your issue already exists. Dependency-cruiser has
a [FAQ](../doc/faq.md) that might help you out.

### Reporting issues

- All **issues** are **welcome**.
  - These include bug reports, questions, feature requests and enhancement
    proposals
  - [GitHub's issue tracker](https://github.com/sverweij/dependency-cruiser/issues)
    is the easiest way to submit them.
- In turn, we try to **respond within a week**.  
  This might or might not include an actual code fix.
- If there's something that doesn't fit an issue, feel free to contact us on
  Mastodon [@mcmeadow@mstdn.social](https://mstdn.social/@mcmeadow) (or
  on twitter, while it lasts [@mcmeadow](https://twitter.com/mcmeadow))

### Contributing code

- We prefer well documented
  **[pull requests](https://help.github.com/articles/creating-a-pull-request/)**
  based on the most recent version of the **develop** branch.
- Code quality
  - Dependency-cruiser has a bunch of automated checks (test coverage, depcruise,
    linting, code formatting). They also run on the CI, but you can save yourself
    time by running them locally already: `npm run check:full` (or `yarn check:full`).
  - Do add tests for new and updated code. It not only helps PR reviewers a lot,
    it'll prevent regressions in the future.
  - Code style (you know, petty things like indentations, where brackets go,
    how variables & parameters are named) fits in with the current code base.
- Plan to do something drastic?  
  Leave an [issue](https://github.com/sverweij/dependency-cruiser/issues/new/choose)
  on GitHub, so we can talk about it.
- dependency-cruiser is released with a [code of conduct](../CODE_OF_CONDUCT.md), adapted
  from the [contributor covenant](http://contributor-covenant.org/).

### Legal

- the code you add will be subject to
  [the MIT license](../LICENSE), just like the rest of dependency-cruiser
- the code you add is your own original work
