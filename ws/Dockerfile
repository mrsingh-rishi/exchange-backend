FROM node:18

WORKDIR /app

COPY package.json tsconfig.json ./

COPY .env.example .env

RUN npm install && npm install -g typescript

COPY . .

EXPOSE 3001

RUN tsc -b

CMD ["node", "dist/index.js"]