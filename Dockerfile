FROM node:20.6-alpine3.17

ENV NODE_ENV production

WORKDIR /usr/server

COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN ls -a
RUN yarn install
RUN yarn build

FROM node:20.6-alpine3.17

ENV NODE_ENV production

WORKDIR /usr/server
COPY package*.json ./
RUN yarn install --production

COPY --from=0 /usr/server/dist .
RUN npm install pm2 -g

EXPOSE 80
# CMD [ "npm", "start", "dev" ]
# CMD ["node", "src/index.js"]
CMD ["pm2-runtime", "index.js"]
