.SUFFIXES: .js .css .html
NODE=node
RM=rm -f
GENERATED_SOURCES=src/cli/init-config/config.js.template.js \
	src/report/dot/dot.template.js \
	src/report/html/html.template.js \
	src/report/error-html/error-html.template.js \
	src/schema/baseline-violations.schema.mjs \
	src/schema/configuration.schema.mjs \
	src/schema/cruise-result.schema.mjs \
	src/schema/baseline-violations.schema.json \
	src/schema/configuration.schema.json \
	src/schema/cruise-result.schema.json \
	src/meta.js

SCHEMA_SOURCES=tools/schema/baseline-violations.schema.mjs \
	tools/schema/cache-options.mjs \
	tools/schema/cache-strategy-type.mjs \
	tools/schema/compound-donot-follow-type.mjs \
	tools/schema/compound-exclude-type.mjs \
	tools/schema/compound-focus-type.mjs \
	tools/schema/compound-include-only-type.mjs \
	tools/schema/configuration.schema.mjs \
	tools/schema/cruise-result.schema.mjs \
	tools/schema/dependencies.mjs \
	tools/schema/dependency-type.mjs \
	tools/schema/folders.mjs \
	tools/schema/module-system-type.mjs \
	tools/schema/module-systems-type.mjs \
	tools/schema/modules.mjs \
	tools/schema/options-used.mjs \
	tools/schema/options.mjs \
	tools/schema/output-type.mjs \
	tools/schema/re-as-strings-type.mjs \
	tools/schema/reporter-options.mjs \
	tools/schema/restrictions.mjs \
	tools/schema/revision-data.mjs \
	tools/schema/rule-set.mjs \
	tools/schema/rule-summary.mjs \
	tools/schema/severity-type.mjs \
	tools/schema/summary.mjs \
	tools/schema/violation-type.mjs \
	tools/schema/violations.mjs

.PHONY: help build clean

# "phony" targets
build: $(GENERATED_SOURCES)

clean:
	$(RM) $(GENERATED_SOURCES)

help:
	@echo
	@echo " -------------------------------------------------------- "
	@echo "| More information and other targets: open the Makefile  |"
	@echo " -------------------------------------------------------- "
	@echo
	@echo "Useful targets:"
	@echo
	@echo "build. When necessary this ..."
	@echo "  - ... recompiles the handlebar templates"
	@echo "  - ... re-generates the json schema"
	@echo
	@echo "clean. Removes all generated sources."
	@echo

# production rules
src/%.template.js: src/%.template.hbs
	npx handlebars --min --commonjs handlebars/runtime -f $@ $<

src/%.schema.mjs: tools/%.schema.mjs $(SCHEMA_SOURCES) tools/generate-schemas.utl.mjs
	$(NODE) ./tools/generate-schemas.utl.mjs $@

src/%.schema.json: tools/%.schema.mjs $(SCHEMA_SOURCES) tools/generate-schemas.utl.mjs
	$(NODE) ./tools/generate-schemas.utl.mjs $@

src/meta.js: package.json tools/generate-meta.utl.mjs
	$(NODE) ./tools/generate-meta.utl.mjs < $< > $@
	npx prettier --write $@
