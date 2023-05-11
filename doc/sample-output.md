# Daphne's dependencies

_A gentle introduction to dependency-cruiser_

Daphne is a software engineer. She works on a project where everything in a
folder called `sub` (not _her_ choice) got deprecated. So she adds rule to
the `.dependency-cruiser.json` in the root of her project:

```json
{
  "forbidden": [
    {
      "name": "sub-not-allowed",
      "severity": "error",
      "from": { "pathNot": "sub" },
      "to": { "path": "sub" }
    }
  ]
}
```

Dependencies from everywhere to the `sub` folder are _verboten_ from now on.
Except when they come from sub itself. :heart:.

## dot

To get a feel of what she's in to, she runs a dep-cruise and runs the result
through dot. (_Daphne is like that. She and her command line: a *terrifying*
weapon._)

```sh
dependency-cruise -v -T dot test/fixtures | dot -T png > sample-dot-output.png
```

![sample dot output](https://raw.githubusercontent.com/sverweij/dependency-cruiser/develop/doc/assets/sample-dot-output.png)

## err

Her `Makefile` already has `dep-cruise` target, which is run as part of the
checks on her ci. (She also has a run script in her package.json, because her
colleagues like that, but she prefers `make` herself - it's how she's wired)

Lo and behold - on the next push to her feature branch the build neatly fails.
She _loves_ how the exit code reflects the number of offending dependencies when
she uses the `err` output type:

```sh
dependency-cruise -T err -v test/fixtures

  error sub-not-allowed: test/fixtures/cjs/root_one.js → test/fixtures/cjs/sub/dir.js
  error sub-not-allowed: test/fixtures/cjs/two_only_one.js → test/fixtures/cjs/sub/dir.js

✖ 2 violations (2 errors, 0 warnings)

make: *** [dependency-cruise] Error 2
```

(Daphne also loves how `-T err` just _shuts up_ and _stays out of her way_
if there's nothing wrong.)

So she gets on to refactor the code to obliterate those doubly blasted
modules in `sub`.

## html

In the mean Alex, who's an architect in Daphne's project, gets a whiff of what
is afoot and heads over to the visual build output.

The build server _knows_ its architect, so it put a dependency report in a spot
where Alex can find it easily. This is the _command_:

```sh
dependency-cruise -v -T html -f stuff-for-alex/sample-dot-output.html test/fixtures
```

(_Actually the build server didn't. You know that. Build servers aren't that
nice. In fact that darn clever Daphne put it in her Makefile. Near her coverage
reporting. The build server just ran it blindly._)

![sample html output](https://raw.githubusercontent.com/sverweij/dependency-cruiser/develop/doc/assets/sample-html-output.png)

Alex gets a little cramp in her neck, just when she discovers
the tiny little _rotate_ button. That's better:
![sample html output - rotated](https://raw.githubusercontent.com/sverweij/dependency-cruiser/develop/doc/assets/sample-html-rotated-output.png)

## csv

Daphne and Alex are covered. Their micro-managing spreadsheet hugging senior
environs, however, is not. Hence: comma separated values. In a file. So excel
(or LibreOffice) can chug it like it's 1999:

```sh
dependency-cruise -v -T csv -f sample-dot-output.csv test/fixtures
```

![oldskool csv output. In a spreadsheet. Way out man!](https://raw.githubusercontent.com/sverweij/dependency-cruiser/develop/doc/assets/sample-csv-output.png)

## json

This is there for the _persona_ 'Marty the maintainer', so he can debug things.

```sh
dependency-cruise -T json -v -f sample-json-output.json test/fixtures
```

The result is rather voluminous, so here's just a link if you want to see it
[assets/sample-json-output.json](https://raw.githubusercontent.com/sverweij/dependency-cruiser/develop/doc/assets/sample-json-output.json).
