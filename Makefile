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
	python3 tools/build_strings.py data/strings.csv | prettier > src/include/data/built_strings.jsxinc

build-commands:  ## build command objects from csv input file
	@echo "⚙️ building command objects..."
	python3 tools/build_commands.py | prettier > src/include/data/built_commands.jsxinc

copy:  ## copy compiled script to Ai scripts folder
	cp AiCommandPalette.jsx /Applications/Adobe\ Illustrator\ 2025/Presets.localized/en_US/Scripts

reset: compile copy  ## re-compile script and copy to Ai scripts folder

##@ Build
watch:  ## watch for file changes and compile
	watchman-make -p 'src/**/*.jsx*' -t reset

compile:  ## compile script using escompile
	escompile src/index.jsx > AiCommandPalette.jsx
