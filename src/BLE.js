var bleno = require('bleno');
var checksum = require('nmea-checksum');
var BMP085 = require('bmp085'),
    barometer = new BMP085();

let pressure = 0;
setInterval(function(){barometer.read(function (data) {
    if (data !== null) {
        pressure = Math.round(data.pressure * 100);
    }
})}, 100);

bleno.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        bleno.startAdvertising('MyDevice',['e079c6a0-aa8b-11e3-a903-0002a5d5c51b']);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    if (!error) {
        bleno.setServices([
            new bleno.PrimaryService({
                uuid : 'e079c6a0-aa8b-11e3-a903-0002a5d5c51b',
                characteristics : [
                    new bleno.Characteristic({
                        value : null,
                        uuid : '0000FFE1-0000-1000-8000-00805F9B34FB',
                        properties : ['notify', 'read', 'write'],
                        onSubscribe : function(maxValueSize, updateValueCallback) {
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
