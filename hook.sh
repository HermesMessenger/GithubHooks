#!/bin/bash

wget -O projectmaster.zip -q https://github.com/Codernauts/social-network/archive/master.zip

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    rm -rf Produccion-Social

    mv social-network-master Produccion-Social
    
    chmod +x ./Produccion-Social/start.sh	
	
    #check if there is a process running to avoid calling kill without pid
    total_process=`ps -edaf|grep -i "start.sh"|wc -l`
    if [ $total_process -gt 1 ];
    then    
        numpid=`ps -edaf|grep -i "start.sh"|grep -v "grep"|cut -d" " -f4`
    
        echo "Killing process $numpid "   
        kill -9 $numpid
    else
	echo "No processes to kill"
    fi
    nohup ./Produccion-Social/start.sh &> trazas.log &
    
    echo "Started :)"
fi

