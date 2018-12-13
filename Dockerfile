FROM resin/rpi-raspbian

MAINTAINER Philippe Le Van <philippe.levan@kibatic.com>

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
	apt-get install -yqq \
		curl \
		build-essential \
		bluetooth \
		bluez \
		libbluetooth-dev \
		libudev-dev \
		usbutils

RUN curl -O https://nodejs.org/dist/v6.11.1/node-v6.11.1-linux-armv6l.tar.xz && \
    tar -Jxvf node-v6.11.1-linux-armv6l.tar.xz && \
    cd node-v6.11.1-linux-armv6l && \
    sudo cp -R * /usr/local

RUN apt-get install -yqq python vim

RUN npm install -g yarn

RUN mkdir /src

ADD docker/start.sh /usr/local/bin/docker-start.sh

RUN chmod a+x /usr/local/bin/docker-start.sh

WORKDIR /src

CMD ["/usr/local/bin/docker-start.sh"]
