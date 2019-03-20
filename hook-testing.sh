#!/bin/bash

branch='testing'

wget -O projectmaster.zip -q "https://github.com/Codernauts/Hermes/archive/$branch.zip"

target_dir="Produccion-Social-Testing"

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    cp config-testing.json "Hermes-$branch"/config.json

    (cd "Hermes-$branch"; npm i)

    pm2 stop "Testing"

    rm -rf $target_dir

    mv "Hermes-$branch" $target_dir

    pm2 start "Testing"

    sleep 5

    echo "Started :)"
fi
