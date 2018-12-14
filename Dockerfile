FROM resin/raspberrypi3-node:8-slim
WORKDIR /app

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
	apt-get install -yqq \
		bluetooth \
		build-essential \
		python \
		bluez \
		libbluetooth-dev \
		libudev-dev

ADD src/package.json src/packge-lock.json /app/
RUN npm install
ADD src /app

CMD ["npm", "start"]
