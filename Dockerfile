FROM node:18

WORKDIR /api

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3333

CMD [ "npm", "run", "dev:server" ]
