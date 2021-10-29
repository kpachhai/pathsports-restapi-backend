FROM node:12-slim
LABEL MAINTAINER="wakqasahmed"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "./dist/app.js"]