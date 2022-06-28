FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=development
ENV WATCHPACK_POLLING=true

RUN npm install

CMD ["npm", "start"]