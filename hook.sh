#!/bin/bash

wget -O projectmaster.zip -q https://github.com/Codernauts/social-network/archive/master.zip

target_dir="Produccion-Social"
if [ -f projectmaster.zip ]; then
 	
    #check if there is a process running to avoid calling kill without pid
    total_process=`ps -edaf|grep -i "start.sh"|wc -l`
    if [ $total_process -gt 1 ];
    then    
        numpid=`ps -edaf|grep -i "start.sh"|grep -v "grep"|cut -d" " -f3`
    
        echo "Killing process $numpid "   
        echo "kill -n 9 $numpid"
    else
	echo "No processes to kill"
    fi
    unzip -q projectmaster.zip

    rm projectmaster.zip

    rm -rf $target_dir

    mv social-network-master Produccion-Social
    
    chmod +x $target_dir/start.sh	
    #nohup ./Produccion-Social/start.sh &> trazas.log &
    current_dir=`pwd`
    cd $target_dir
    #npm install #installing modules
    nohup ./start.sh > $current_dir/trazas.log & 
    echo "Started :)"
fi
