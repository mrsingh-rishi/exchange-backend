# Stock Exchange Platform

A real-time, high-frequency Stock Exchange platform designed for low-latency order matching, market data updates, and efficient trade notifications. This platform leverages microservices architecture and ensures horizontal scalability, handling high concurrency and large user volumes. It integrates WebSocket for real-time updates, PostgreSQL for database persistence, Redis for message queuing, and Prisma for ORM.

## Architecture Overview

The system is built around multiple microservices to ensure modularity and scalability:

- **API Service**: Exposes RESTful APIs for order placement and market data retrieval.
- **DB Service**: Handles data persistence with PostgreSQL, managed using Prisma.
- **Engine Service**: Manages the core business logic, including the order book and matching engine.
- **WebSocket (WS) Service**: Provides real-time updates for stock prices, order book depths, trades, and more.

![Architecture Diagram](https://github.com/user-attachments/assets/eacc7563-e594-4928-b7d5-626e32a214f5)


*Figure 1: Overview of the Stock Exchange system architecture.*

## Features

- **Real-Time Updates**: WebSocket integration for live stock price and trade updates.
- **High-Frequency Order Matching**: Optimized system for quick order execution.
- **Low-Latency**: Fast data processing and low-latency trade notifications.
- **Scalable Architecture**: Horizontal scalability with Redis and Pub/Sub for communication.
- **Efficient Order Book Management**: The engine service efficiently handles order book operations.
- **Database Persistence**: PostgreSQL for storing trade data, orders, and transaction history.

## Technologies

- **Node.js**: Server-side runtime environment for building the backend services.
- **Express.js**: Web framework used to build the RESTful APIs.
- **WebSockets**: Real-time data updates for stock price, order book, and trades.
- **PostgreSQL**: Relational database for storing orders, trades, and market data.
- **Prisma**: ORM for interacting with the PostgreSQL database.
- **Redis**: Message queue and Pub/Sub system for asynchronous communication between services.

## Services

1. **API Service**
   - Exposes endpoints for placing orders and retrieving market data.
   - Allows users to interact with the stock exchange platform.
   
2. **DB Service**
   - Responsible for writing data to PostgreSQL.
   - Ensures data consistency and integrity across the platform.
   
3. **Engine Service**
   - Core business logic, including order book management and order matching.
   - Handles all operations related to matching buy and sell orders.
   
4. **WebSocket (WS) Service**
   - Provides real-time updates for stock prices, order books, and trade notifications.
   - Ensures that users are always up-to-date with live market data.

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- Docker and Docker Compose (optional, for Dockerized version)
- PostgreSQL and Redis (Docker containers or local setup)

### Method 1: Local Installation

If you'd like to run the application locally without Docker, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/user/stock-exchange.git
    cd stock-exchange
    ```

2. **Install dependencies for each service:**

    For each service (`api`, `db`, `engine`, `ws`), navigate to the service directory and install dependencies:

    ```bash
    cd api
    npm install
    cd ..
    cd engine
    npm install
    cd ..
    cd ws
    npm install
    cd ..
    ```

3. **Configure environment variables:**

    Copy the `.env.example` files from the relevant directories (`api`, `engine`, `ws`) to `.env` and update them with your PostgreSQL and Redis credentials.

4. **Run PostgreSQL and Redis:**

    Ensure PostgreSQL and Redis are running locally or use Docker for them. For local installations, you can use the following:

    ```bash
    docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
    docker run --name some-redis -d redis
    ```

5. **Run the services:**

    Start each service separately using `npm start`:

    ```bash
    cd api
    npm start
    cd ..
    cd engine
    npm start
    cd ..
    cd ws
    npm start
    cd ..
    ```

6. **Run Prisma Migrations:**

    Run the Prisma migrations to set up the database schema:

    ```bash
    cd api
    npm run prisma:migrate
    npm run prisma:generate
    ```

7. **Seed the Database (Optional):**

    You can seed the database with initial data:

    ```bash
    cd api
    npm run seed
    ```

---

### Method 2: Docker Installation

If you'd like to run the platform using Docker, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/user/stock-exchange.git
    cd stock-exchange
    ```

2. **Build Docker images:**

    ```bash
    docker-compose build
    ```

3. **Start the application:**

    ```bash
    docker-compose up
    ```

    This will start the backend API, engine service, WebSocket service, database, and Redis services. Ensure that Docker and Docker Compose are installed and running on your system.

4. **Access the platform:**

    The application will be accessible via the following ports:
    - API Service: `http://localhost:3000`
    - WebSocket Service: `ws://localhost:4000`
