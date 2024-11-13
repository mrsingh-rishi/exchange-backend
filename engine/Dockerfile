FROM node:18

WORKDIR /app

COPY package.json tsconfig.json ./

COPY .env.example .env

RUN npm install && npm install -g typescript

COPY . .


RUN npm run build

CMD ["npm", "start"]