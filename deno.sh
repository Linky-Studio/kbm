#!/bin/bash

if [ "$1" = "start" ]
then
	deno --unstable run --allow-read --allow-write --allow-net --allow-env --allow-run code/start.ts --symbols "$2" --port "$3"
elif [ "$1" = "uncloned" ]
then
	deno --unstable run --allow-read --allow-write --allow-net --allow-env --allow-run https://cdn.jsdelivr.net/gh/Linky-Studio/kbm/code/start.ts --symbols "$2" --port "$3"
elif [ "$1" = "clean" ]
then
	rm -rf data
else
	echo No command given. Try "start ETHUSDT 8008" or "clean"
fi
