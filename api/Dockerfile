FROM node:18

WORKDIR /app

COPY package.json tsconfig.json ./

RUN npm install -g typescript && npm install

COPY . .

# COPY .env.example .env

# ENV DATABASE_URL="postgres://postgres:password@postgres:5432/stock-exchange"

EXPOSE 3000

RUN npm run build

CMD ["sh", "-c", "npm run prisma:generate && npm start"]
