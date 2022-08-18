SHELL:=/bin/bash

.PHONY: help

.PHONY: configure install

DEBUG ?= ''

API_KEY ?= '_'
API_SECRET ?= '_'
ACCESS_TOKEN ?= '_'
ACCESS_SECRET ?= '_'
SCREEN_NAME ?= '_'

help: doc
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

doc: ### Output the README documentation
	@command -v bat && bat ./README.md || cat ./README.md

install: ### Install requirements
	@/bin/bash -c "source fun.sh && install"

configure: ### API_KEY= API_SECRET= ACCESS_TOKEN= ACCESS_SECRET= SCREEN_NAME= make configure
	@/bin/bash -c "source fun.sh && configure"
