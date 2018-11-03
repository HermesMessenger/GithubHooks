#!/bin/bash

target_dir="Produccion-Social"
wget -O projectmaster.zip -q https://github.com/Codernauts/Hermes/archive/master.zip

if [ -f projectmaster.zip ]; then

    echo "Stopping server"
    pm2 stop server

    unzip -q projectmaster.zip
    rm projectmaster.zip

    rm -rf $target_dir

    mv Hermes-master $target_dir
    cd $target_dir

    npm install
    pm2 start server.js

    echo "Started :)"
fi
