FROM node:alpine

ENV API_KEY \
    API_SECRET \
    ACCESS_TOKEN \
    ACCESS_TOKEN_SECRET \
    SCREEN_NAME 

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT ["node", "index.js"]