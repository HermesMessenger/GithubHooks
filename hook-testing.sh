#!/bin/bash

branch='testing'

wget -O projectmaster.zip -q "https://github.com/Codernauts/Hermes/archive/$branch.zip"

target_dir="Produccion-Social-Testing"

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    (cd "Hermes-$branch"; npm i)

    pm2 stop "Hermes Testing"

    rm -rf $target_dir

    mv "Hermes-$branch" $target_dir

    sed -i 's/8080/8081/g' "$target_dir/server.js" # Replace port 8080 with 8081 so both servers don't run on the same port

    pm2 start "Hermes Testing"

    sleep 5

    echo "Started :)"
fi
