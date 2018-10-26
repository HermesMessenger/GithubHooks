#!/bin/bash

wget -O projectmaster.zip -q https://github.com/Codernauts/social-network/archive/master.zip

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    rm -rf Produccion-Social

    mv social-network-master Produccion-Social
    
    chmod +x ./Produccion-Social/start.sh

    kill -9 `ps -edaf|grep -i "start.sh"|grep -v "grep"|cut -d" " -f4`
    
    nohup ./Produccion-Social/start.sh &> trazas.log &
    
    echo "Started :)"
fi
