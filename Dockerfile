FROM node:16-alpine
WORKDIR /app
COPY ./node_modules ./node_modules
COPY ./build ./build
ENV NODE_PATH=./build
ENV NODE_ENV=production

# ENTRYPOINT ["node", "./build/app.js"]
CMD ["node", "./build/app.js"]
