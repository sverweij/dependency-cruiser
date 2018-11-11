.SUFFIXES: .js .css .html
NODE=node
RM=rm -f
GENERATED_SOURCES=src/report/csv/csv.template.js \
	src/report/dot/dot.template.js \
	src/report/html/html.template.js

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
src/report/%.template.js: src/report/%.template.hbs
	./node_modules/.bin/handlebars --commonjs handlebars/runtime -f $@ $<

# "phony" targets
dev-build: $(GENERATED_SOURCES)

profile:
	$(NODE) --prof src/cli.js -f - test
	@echo "output will be in a file called 'isolate-xxxx-v8.log'"
	@echo "- translate to readable output with:"
	@echo "    node --prof-process isolate-xxxx-v8.log | more"

clean:
	$(RM) $(GENERATED_SOURCES)