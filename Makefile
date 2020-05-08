.SUFFIXES: .js .css .html
NODE=node
RM=rm -f
GENERATED_SOURCES=src/cli/init-config/config.js.template.js \
	src/report/dot/dot.template.js \
	src/report/html/html.template.js \
	src/report/error-html/error-html.template.js \
	src/schema/configuration.schema.json \
	src/schema/cruise-result.schema.json

SCHEMA_SOURCES=utl/schema/compound-exclude-type.mjs \
	utl/schema/compound-donot-follow-type.mjs \
	utl/schema/dependencies.mjs \
	utl/schema/dependency-type.mjs \
	utl/schema/module-system-type.mjs \
	utl/schema/module-systems-type.mjs \
	utl/schema/modules.mjs \
	utl/schema/options-used.mjs \
	utl/schema/options.mjs \
	utl/schema/output-type.mjs \
	utl/schema/reporter-options.mjs \
	utl/schema/restrictions.mjs \
	utl/schema/rule-set.mjs \
	utl/schema/rule-summary.mjs \
	utl/schema/severity-type.mjs \
	utl/schema/summary.mjs

.PHONY: help dev-build clean

help:
	@echo
	@echo " -------------------------------------------------------- "
	@echo "| More information and other targets: open the Makefile  |"
	@echo " -------------------------------------------------------- "
	@echo
	@echo "Useful targets:"
	@echo
	@echo "dev-build. If necessary this ..."
	@echo "- ... recompiles the handlebar templates"
	@echo
	@echo "clean. Removes all generated sources."
	@echo
	@echo "uses to infer whether re-compilation is necessary."
	@echo

# production rules
src/%.template.js: src/%.template.hbs
	npx handlebars --commonjs handlebars/runtime -f $@ $<

src/%.schema.json: utl/%.schema.mjs $(SCHEMA_SOURCES)
	$(NODE) --experimental-modules ./utl/generate-schemas.utl.mjs

# "phony" targets
dev-build: $(GENERATED_SOURCES)

clean:
	$(RM) $(GENERATED_SOURCES)
