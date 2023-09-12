PWD := $(realpath $(dir $(abspath $(firstword $(MAKEFILE_LIST)))))

.DEFAULT_GOAL := help
.PHONY: help
##@ General
help: ## Display this help section
	@echo $(MAKEFILE_LIST)
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development
commands:  ## download latest command data
	@echo "⬇️ download commands..."
	python tools/build_data.py -d > src/include/data.jsxinc
	prettier -w src/include/data.jsxinc

copy:  ## copy compiled script to Ai scripts folder
	cp AiCommandPalette.jsx /Applications/Adobe\ Illustrator\ 2023/Presets.localized/en_US/Scripts

reset: compile copy  ## re-compile script and copy to Ai scripts folder

##@ Build
compile:  ## compile script using escompile
	/Users/jbd/Dropbox/DEV/projects/extend-script-compiler/escompile.sh src/index.jsx > AiCommandPalette.jsx