.SUFFIXES: .js .css .html
GIT=git
GIT_CURRENT_BRANCH=$(shell utl/get_current_git_branch.sh)
GIT_DEPLOY_FROM_BRANCH=master
NPM=npm
NODE=node
RM=rm -f
MAKEDEPEND=node_modules/.bin/js-makedepend --exclude "node_modules|fixtures|extractor-fixtures" --system cjs
GENERATED_SOURCES=src/report/csv.template.js \
	src/report/dot.template.js \
	src/report/err.template.js \
	src/report/html.template.js

.PHONY: help dev-build install check fullcheck mostlyclean clean lint cover prerequisites static-analysis test update-dependencies run-update-dependencies depend

help:
	@echo
	@echo " -------------------------------------------------------- "
	@echo "| More information and other targets: open the Makefile  |"
	@echo " -------------------------------------------------------- "
	@echo

# production rules
src/report/%.template.js: src/report/%.template.hbs
	handlebars --commonjs handlebars/runtime -f $@ $<

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: bin/dependency-cruise $(GENERATED_SOURCES) $(ALL_SRC)

lint:
	$(NPM) run lint

cover: dev-build
	$(NPM) run cover

bump-patch:
	$(NPM) version patch

bump-minor:
	$(NPM) version minor

bump-major:
	$(NPM) version major

tag:
	$(GIT) tag -a v`utl/getver` -m "v`utl/getver`"
	$(GIT) push --tags

publish:
	$(GIT) push
	$(GIT) push --tags
	$(NPM) publish

profile:
	$(NODE) --prof src/cli.js -f - test
	@echo "output will be in a file called 'isolate-xxxx-v8.log'"
	@echo "- translate to readable output with:"
	@echo "    node --prof-process isolate-xxxx-v8.log | more"

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

update-dependencies: run-update-dependencies dev-build test
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

dependency-cruise:
	./bin/dependency-cruise -T err -r .dependency-cruiser-custom.json src

check: lint test dependency-cruise
	./bin/dependency-cruise --version # if that runs the cli script works

fullcheck: check outdated nsp

depend:
	$(MAKEDEPEND) src/index.js
	$(MAKEDEPEND) --append --flat-define ALL_SRC src/index.js
	$(MAKEDEPEND) --append test

clean:
	$(RM) $(GENERATED_SOURCES)

# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# cjs dependencies
src/index.js: \
	package.json \
	src/cli/index.js

src/cli/index.js: \
	src/cli/optionNormalizer.js \
	src/cli/parameterValidator.js \
	src/extract/index.js \
	src/report/csvReporter.js \
	src/report/dotReporter.js \
	src/report/errReporter.js \
	src/report/htmlReporter.js \
	src/report/jsonReporter.js

src/extract/index.js: \
	src/extract/extractor.js \
	src/utl/index.js

src/extract/extractor.js: \
	src/extract/extractor-AMD.js \
	src/extract/extractor-ES6.js \
	src/extract/extractor-commonJS.js \
	src/extract/resolver.js \
	src/utl/index.js \
	src/validate/validator.js

src/extract/extractor-AMD.js: \
	src/extract/extractor-commonJS.js

src/extract/resolver.js: \
	src/utl/index.js

src/report/csvReporter.js: \
	src/report/csv.template.js \
	src/report/dependencyToIncidenceTransformer.js

src/report/dotReporter.js: \
	src/report/dot.template.js

src/report/errReporter.js: \
	src/report/err.template.js

src/report/htmlReporter.js: \
	src/report/dependencyToIncidenceTransformer.js \
	src/report/html.template.js

src/cli/parameterValidator.js: \
	src/utl/index.js

# cjs dependencies
ALL_SRC=src/index.js \
	package.json \
	src/cli/index.js \
	src/cli/optionNormalizer.js \
	src/cli/parameterValidator.js \
	src/extract/extractor-AMD.js \
	src/extract/extractor-ES6.js \
	src/extract/extractor-commonJS.js \
	src/extract/extractor.js \
	src/extract/index.js \
	src/extract/resolver.js \
	src/report/csv.template.js \
	src/report/csvReporter.js \
	src/report/dependencyToIncidenceTransformer.js \
	src/report/dot.template.js \
	src/report/dotReporter.js \
	src/report/err.template.js \
	src/report/errReporter.js \
	src/report/html.template.js \
	src/report/htmlReporter.js \
	src/report/jsonReporter.js \
	src/utl/index.js \
	src/validate/validator.js
# cjs dependencies
test/cli.index.spec.js: \
	src/cli/index.js \
	test/utl/testutensils.js

src/cli/index.js: \
	src/cli/optionNormalizer.js \
	src/cli/parameterValidator.js \
	src/extract/index.js \
	src/report/csvReporter.js \
	src/report/dotReporter.js \
	src/report/errReporter.js \
	src/report/htmlReporter.js \
	src/report/jsonReporter.js

src/extract/index.js: \
	src/extract/extractor.js \
	src/utl/index.js

src/extract/extractor.js: \
	src/extract/extractor-AMD.js \
	src/extract/extractor-ES6.js \
	src/extract/extractor-commonJS.js \
	src/extract/resolver.js \
	src/utl/index.js \
	src/validate/validator.js

src/extract/extractor-AMD.js: \
	src/extract/extractor-commonJS.js

src/extract/resolver.js: \
	src/utl/index.js

src/report/csvReporter.js: \
	src/report/csv.template.js \
	src/report/dependencyToIncidenceTransformer.js

src/report/dotReporter.js: \
	src/report/dot.template.js

src/report/errReporter.js: \
	src/report/err.template.js

src/report/htmlReporter.js: \
	src/report/dependencyToIncidenceTransformer.js \
	src/report/html.template.js

src/cli/parameterValidator.js: \
	src/utl/index.js

test/cli.optionNormalizer.spec.js: \
	src/cli/optionNormalizer.js

test/cli.parameterValidator.spec.js: \
	src/cli/parameterValidator.js

test/extract.extractor-composite.spec.js: \
	src/extract/index.js

test/extract.extractor.spec.js: \
	src/extract/extractor.js

test/report.errReporter.spec.js: \
	src/report/errReporter.js

test/validate.validator.spec.js: \
	src/validate/validator.js

