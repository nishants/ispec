FROM node:14
RUN npm install grpc-devtool -g

RUN mkdir /app
COPY ./ /app/

WORKDIR /app

CMD ["grpc", "serve", "."]