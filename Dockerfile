FROM node:latest
USER root
WORKDIR /app
COPY package.json tsconfig.json ./
RUN yarn install

COPY ./src ./src
RUN yarn build

ENV NODE_ENV=production
EXPOSE 5050
CMD ["yarn", "start"]
