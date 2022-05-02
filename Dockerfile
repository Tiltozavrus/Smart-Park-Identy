FROM node:17.9.0-alpine3.15

EXPOSE 5513

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

CMD ["node", "build/src/main"]