.SUFFIXES: .js .css .html
NODE=node
RM=rm -f
GENERATED_SOURCES=src/cli/initConfig/config.js.template.js \
	src/report/csv/csv.template.js \
	src/report/dot/dot.template.js \
	src/report/html/html.template.js \
	src/report/err-html/err-html.template.js \
	src/schema/configuration.schema.json \
	src/schema/cruise-result.schema.json

SCHEMA_SOURCES=utl/schema/compound-exclude-type.js \
	utl/schema/compound-donot-follow-type.js \
	utl/schema/dependencies.js \
	utl/schema/dependency-type.js \
	utl/schema/module-system-type.js \
	utl/schema/module-systems-type.js \
	utl/schema/modules.js \
	utl/schema/options-used.js \
	utl/schema/options.js \
	utl/schema/output-type.js \
	utl/schema/reporter-options.js \
	utl/schema/restrictions.js \
	utl/schema/rule-set.js \
	utl/schema/rule-summary.js \
	utl/schema/severity-type.js \
	utl/schema/summary.js

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

src/%.schema.json: utl/%.schema.js $(SCHEMA_SOURCES)
	$(NODE) ./utl/generate-schemas.utl.js

# "phony" targets
dev-build: $(GENERATED_SOURCES)

clean:
	$(RM) $(GENERATED_SOURCES)
