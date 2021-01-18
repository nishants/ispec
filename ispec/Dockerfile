FROM node:14

RUN mkdir -p /ispec/src

WORKDIR /ispec

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY src/ /ispec/src/
COPY bin/ /ispec/bin/

RUN npm install -g