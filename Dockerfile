FROM alpine:3.14

ENV NODE_VERSION 16.14.0

RUN apk add --update nodejs npm

RUN npm install -g @nestjs/cli

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

EXPOSE 3000