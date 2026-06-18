FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start", "--", "-p", "3001"]