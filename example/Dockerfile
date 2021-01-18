FROM node:14

RUN mkdir -p /app/src

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY src/ /app/src/

EXPOSE 3123
CMD [ "npm", "start" ]