FROM resin/rpi-raspbian

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
	apt-get install -yqq \
		curl \
		build-essential \
		bluetooth \
		bluez \
		libbluetooth-dev \
		libudev-dev \
		python \
		usbutils &&\
    curl -O https://nodejs.org/dist/v6.11.1/node-v6.11.1-linux-armv6l.tar.xz && \
    tar -Jxvf node-v6.11.1-linux-armv6l.tar.xz && \
    cd node-v6.11.1-linux-armv6l && \
    sudo cp -R * /usr/local &&\
    npm install -g yarn

WORKDIR /app
ADD rootfs /
ADD src/yarn.lock src/package.json /app/
RUN yarn install
ADD src /app

CMD ["/start.sh"]
