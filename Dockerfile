# The instructions for the first stage
FROM node:10-alpine as builder
LABEL maintainer="RestQa <team@restqa.io>"
LABEL app="http_proxy"
LABEL name="http moxy"
LABEL description="A light mock http proxy tool to support your End to End automation test. The best way to  mock thrid parties API dependencies"
LABEL repository="https://github.com/restqa/http-moxy"
LABEL url="https://restqa.io/http-moxy"

RUN apk --no-cache add python make g++

COPY package*.json ./
RUN npm install --production
RUN npm ci --only=production


# The instructions for second stage
FROM node:10-alpine

WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules

ENV NODE_ENV=production

COPY . .

RUN npm run build

CMD [ "npm", "start" ]

