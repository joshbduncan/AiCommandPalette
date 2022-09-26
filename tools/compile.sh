#!/bin/bash

while IFS= read -r LINE; do
    if [[ $LINE =~ \/\/@includepath ]]
    then
        INCLUDE_PATH=`expr "$LINE" : '.*"\(.*\)"'`
    elif [[ $LINE =~ \/\/@include ]]
    then
        FILE=`expr "$LINE" : '.*"\(.*\)"'`
        cat "src/$INCLUDE_PATH/$FILE"
    else
        echo "$LINE"
    fi
done < $1