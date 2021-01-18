FROM node:14

RUN mkdir -p /app/src

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY src/ /app/src/

EXPOSE 3123
CMD [ "yarn", "start" ]