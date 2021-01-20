# This dockerfie is kep in root so that we can create container for example service
# using the current version of ispec rather than getting it from npm registry.
# Having this in root allows us to add ispec and example to image as both are in context

FROM node:14

RUN mkdir -p /app/src
RUN mkdir -p /ispec

COPY example/package.json ./app
#COPY example/yarn.lock ./app

COPY example/src /app/src/
COPY example/protos /app/protos/

COPY ispec/ /ispec/

WORKDIR /app

RUN yarn

EXPOSE 3123
CMD [ "yarn", "start" ]