FROM node:16-alpine AS DEPS
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN yarn install 


# Rebuild the source code only when needed
FROM node:16-alpine AS BUILDER
WORKDIR /app
COPY --from=DEPS /app/node_modules ./node_modules
COPY . .
RUN yarn build && rm -rf node_modules && yarn install --production


# Production image, copy all the files and run next
FROM node:16-alpine AS RUNNNER
WORKDIR /app
ENV NODE_ENV production
COPY --from=BUILDER /app/node_modules  ./node_modules
COPY --from=BUILDER /app/package.json  ./
COPY --from=BUILDER /app/.next ./.next
COPY --from=BUILDER /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start"]