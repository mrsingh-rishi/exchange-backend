FROM node:18

WORKDIR /app

COPY package.json tsconfig.json ./


RUN npm install -g typescript && npm install

COPY . .

# COPY .env.example .env

# ENV DATABASE_URL="postgres://postgres:password@postgres:5432/stock-exchange"

EXPOSE 3000

RUN npm run build

RUN npm run prisma:generate

CMD ["sh", "-c", "npm run prisma:ready && npm run seed:db && npm run refresh:views && npm start"]
