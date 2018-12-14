FROM resin/raspberrypi3-node:8-slim

WORKDIR /app
ADD src /app

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
	apt-get install -yqq \
		bluetooth \
		build-essential \
		python \
		bluez \
		libbluetooth-dev \
		libudev-dev &&\
		npm install

CMD ["npm", "start"]
