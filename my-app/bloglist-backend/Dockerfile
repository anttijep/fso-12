FROM node:16
  
WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci --only=production

ENV NODE_ENV=production
  
USER node
CMD ["npm", "start"]
