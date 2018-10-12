all: compiled docs

compiled: clean_compiled
	npx tsc

docs: api_maybe api_either api_response

docs_dir:
	mkdir -p docs/api/

api_maybe: compiled docs_dir
	jsdoc2md compiled/algebra/maybe.js > docs/api/maybe.md

api_either: compiled docs_dir
	jsdoc2md compiled/algebra/either.js > docs/api/either.md

api_response: compiled docs_dir
	jsdoc2md compiled/algebra/response.js > docs/api/response.md

clean_compiled:
	rm -rf compiled

clean_docs:
	rm -rf docs/api
