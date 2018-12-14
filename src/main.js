var bleno = require('bleno');
var checksum = require('nmea-checksum');
var BMP085 = require('bmp085'),
    barometer = new BMP085({'mode': 3});

let pressure = 999999;
setInterval(function(){barometer.read(function (data) {
    if (data !== null) {
        pressure = Math.round(data.pressure * 100);
    }
})}, 100);

bleno.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        bleno.startAdvertising('pivario',['e079c6a0-aa8b-11e3-a903-0002a5d5c51b']);
    } else {
        bleno.stopAdvertising();
    }
});

// Notify the console that we've accepted a connection
bleno.on('accept', function(clientAddress) {
    console.log("Accepted connection from address: " + clientAddress);
});

// Notify the console that we have disconnected from a client
bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected from address: " + clientAddress);
});

bleno.on('advertisingStart', function(error) {
    if (!error) {
        console.log('advertisingStart')
        bleno.setServices([
            new bleno.PrimaryService({
                uuid : 'e079c6a0-aa8b-11e3-a903-0002a5d5c51b',
                characteristics : [
                    new bleno.Characteristic({
                        value : null,
                        uuid : '0000FFE1-0000-1000-8000-00805F9B34FB',
                        properties : ['notify', 'read', 'write'],
                        onSubscribe : function(maxValueSize, updateValueCallback) {
                            console.log('onSubscribe')
                            this.intervalId = setInterval(function() {
                                let payload = `$LK8EX1,${pressure},99999,9999,99,999,`;
                                payload = payload + '*' + checksum.checksum(payload) + "\r\n";
                                updateValueCallback(new Buffer(payload.substr(0,20)))
                                updateValueCallback(new Buffer(payload.substr(20, payload.length)))
                            }, 100);
                        },

                        onUnsubscribe : function() {
                            clearInterval(this.intervalId);
                        },
                    })
                ]
            })
        ]);
    }
});
