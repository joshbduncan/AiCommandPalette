SHELL := /bin/bash
PWD := $(realpath $(dir $(abspath $(firstword $(MAKEFILE_LIST)))))

.DEFAULT_GOAL := help
.PHONY: help
##@ General
help: ## Display this help section
	@echo $(MAKEFILE_LIST)
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development
build-strings:  ## build string objects from csv input file
	@echo "⚙️ building string objects..."
	python3 tools/build_strings.py | prettier --parser typescript > src/data/built_strings.ts

build-commands:  ## build command objects from csv input file
	@echo "⚙️ building command objects..."
	python3 tools/build_commands.py | prettier --parser typescript > src/data/built_commands.ts

copy:  ## copy compiled script to Ai scripts folder
	cp AiCommandPalette.jsx /Applications/Adobe\ Illustrator\ 2025/Presets.localized/en_US/Scripts

reset: compile wrap copy  ## re-compile script and copy to Ai scripts folder

##@ Build
wrap:  ## wrap built script into an anonymous function
	./tools/wrap_in_anon_function.sh

watchman:
	watchman watch .
	watchman -- trigger . script-jsx-wrap build/bundle.jsx -- ./tools/wrap_in_anon_function.sh
	sudo watchman -- trigger . script-jsx-wrap AiCommandPalette.jsx -- sh -c "cp AiCommandPalette.jsx /Applications/Adobe\ Illustrator\ 2025/Presets.localized/en_US/Scripts"

watch:  ## watch for file changes and compile
	tsc --watch

compile:  ## compile script using escompile
	tsc
