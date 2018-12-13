#!/bin/bash

setcap cap_net_raw+eip $(eval readlink -f `which node`)
exec node BLE.js
