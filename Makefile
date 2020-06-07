.SUFFIXES: .js .css .html
NODE=node
RM=rm -f
GENERATED_SOURCES=src/cli/init-config/config.js.template.js \
	src/report/dot/dot.template.js \
	src/report/html/html.template.js \
	src/report/error-html/error-html.template.js \
	src/schema/configuration.schema.json \
	src/schema/cruise-result.schema.json

SCHEMA_SOURCES=tools/schema/compound-exclude-type.mjs \
	tools/schema/compound-donot-follow-type.mjs \
	tools/schema/dependencies.mjs \
	tools/schema/dependency-type.mjs \
	tools/schema/module-system-type.mjs \
	tools/schema/module-systems-type.mjs \
	tools/schema/modules.mjs \
	tools/schema/options-used.mjs \
	tools/schema/options.mjs \
	tools/schema/output-type.mjs \
	tools/schema/reporter-options.mjs \
	tools/schema/restrictions.mjs \
	tools/schema/rule-set.mjs \
	tools/schema/rule-summary.mjs \
	tools/schema/severity-type.mjs \
	tools/schema/summary.mjs

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

src/%.schema.json: tools/%.schema.mjs $(SCHEMA_SOURCES)
	$(NODE) --experimental-modules ./tools/generate-schemas.utl.mjs $@

# "phony" targets
dev-build: $(GENERATED_SOURCES)

clean:
	$(RM) $(GENERATED_SOURCES)
