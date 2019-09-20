#!/bin/bash

branch=${1:-"master"}
target_dir="Produccion-Social-$branch"

wget -O projectmaster.zip -q "https://github.com/Codernauts/Hermes/archive/$branch.zip"

unzip -q projectmaster.zip &> /dev/null

if [ $? -eq 0 ]; then
    rm projectmaster.zip

    cp "config-$branch.json" "Hermes-$branch"/config.json

    (cd "Hermes-$branch"; npm i)

    pm2 stop "$branch"

    rm -rf $target_dir

    mv "Hermes-$branch" $target_dir

    pm2 start "$branch"

    sleep 5

else 
    echo "Branch $branch not found!"
    exit 1
fi
