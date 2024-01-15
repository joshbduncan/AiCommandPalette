SHELL := /bin/bash
PWD := $(realpath $(dir $(abspath $(firstword $(MAKEFILE_LIST)))))
CSV_URL = https://docs.google.com/spreadsheets/d/1T-pBrLAOL3WuF1K7h6Wo_vIUa0tui9YiX591YqqKMdA

.DEFAULT_GOAL := help
.PHONY: help
##@ General
help: ## Display this help section
	@echo $(MAKEFILE_LIST)
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development
commands:  ## download latest command data
	@echo "⬇️ download commands..."
	venv/bin/python tools/build_data.py -d | prettier > src/include/data.jsxinc

sheet:  ## open the csv builder google sheet
	open ${CSV_URL}

copy:  ## copy compiled script to Ai scripts folder
	cp AiCommandPalette.jsx /Applications/Adobe\ Illustrator\ 2024/Presets.localized/en_US/Scripts

reset: compile copy  ## re-compile script and copy to Ai scripts folder

##@ Build
watch:  ## watch for file changes and compile
	watchman-make -p 'src/**/*.jsx*' -t reset

compile:  ## compile script using escompile
	/Users/jbd/Dropbox/DEV/projects/extend-script-compiler/escompile.sh src/index.jsx > AiCommandPalette.jsx