#!/bin/bash

setcap cap_net_raw+eip $(eval readlink -f `which node`)
cd /src
node BLE.js
