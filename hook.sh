#!/bin/bash

wget -O projectmaster.zip -q https://github.com/Codernauts/Hermes/archive/master.zip

target_dir="Produccion-Social"

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    (cd "Hermes-master"; npm i)

    pm2 stop "Hermes"

    rm -rf $target_dir

    mv Hermes-master $target_dir

    cp config.json $target_dir
    cp assetLinks.json $target_dir/web_client/assetLinks.json

    pm2 start "Hermes"

    sleep 5

    echo "Started :)"
fi
