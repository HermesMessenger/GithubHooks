#!/bin/bash

branch='testing'

wget -O projectmaster.zip -q "https://github.com/Codernauts/Hermes/archive/$branch.zip"

target_dir="Produccion-Social-Testing"

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    (cd "Hermes-$branch"; npm i)

    pm2 stop "Testing"

    rm -rf $target_dir

    mv "Hermes-$branch" $target_dir

    cp config-testing.json $target_dir/config.json
    cp assetLinks.json $target_dir/web_client/assetLinks.json

    pm2 start "Testing"

    sleep 5

    echo "Started :)"
fi
