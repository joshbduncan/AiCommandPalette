#!/bin/bash

# ExtendScript Compiler

# Copyright 2022 Josh Duncan
# https://joshbduncan.com

# See README.md for more info

# This script is distributed under the MIT License.
# See the LICENSE file for details.

# check to make sure file was provided
if [[ $# -eq 0 ]] ; then
    printf "usage: %s [FILE]...\n\nARGS:\n    <FILE>...    Script file to compile from." $(basename $0)
    exit 1
fi

# get the base directory of the script file being processed
BASE_DIR=$(dirname $1)

# set up and array to hold the include paths
INCLUDE_PATHS=( "" )

# read through the script line by line
while IFS= read -r LINE
    do
    
        # if `includepath`` statement split the specified paths into an array and add to INCLUDE_PATHS
        if [[ $LINE =~ (\#|\@)includepath ]]; then
            PATHS_ARRAY=`expr "$LINE" : '.*"\(.*\)"' | tr ';' ' '`
            INCLUDE_PATHS+=(${PATHS_ARRAY[@]})
            continue
        fi
    
        # if `include` file statement try and find that file in `includepath` paths
        if [[ $LINE =~ (\#|\@)include ]]; then
            FP=""
            FILE=`expr "$LINE" : '.*"\(.*\)"'`

            # if an absolute path was specified
            if [[ $FILE =~ ^/ ]] && [ -f $FILE ]; then
                FP=$FILE

            else
                # check in all of the `includepath` paths
                for INCLUDE_PATH in "${INCLUDE_PATHS[@]}"; do
                    # if file is found at current include path break
                    if [ -f "$BASE_DIR/$INCLUDE_PATH/$FILE" ]; then
                        FP="$BASE_DIR/$INCLUDE_PATH/$FILE"
                        break
                    fi
                done

            fi

            # if $FP was a valid path, cat that file out
            if [[ ! -z "$FP" ]]; then
                cat $FP
            else
                >&2 echo "🚨 Whoops, I couldn't find file: $FILE"
                exit 1
            fi
            continue
        fi

        # if it's just a regular line of code just echo it out
        echo "$LINE"

done < $1