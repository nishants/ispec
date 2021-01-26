# This dockerfie is kep in root so that we can create container for grpc-nats-service service
# using the current version of ispec rather than getting it from npm registry.
# Having this in root allows us to add ispec and grpc-nats-service to image as both are in context

FROM node:14

RUN mkdir -p /examples/grpc-nats-service/src
RUN mkdir -p /ispec

COPY examples/grpc-nats-service/package.json /examples/grpc-nats-service
COPY examples/grpc-nats-service/yarn.lock /examples/grpc-nats-service
WORKDIR /examples/grpc-nats-service

RUN yarn

COPY examples/grpc-nats-service/src /examples/grpc-nats-service/src/
COPY examples/grpc-nats-service/protos /examples/grpc-nats-service/protos/

COPY ispec/ /ispec/

EXPOSE 3123
CMD [ "yarn", "start" ]