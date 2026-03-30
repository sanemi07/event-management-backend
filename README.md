# Event Booking Backend

A Node.js + Express + TypeScript backend for event management, ticket booking, and attendance tracking. The project uses Prisma with MySQL and includes OpenAPI documentation, Docker support, and a deployment-ready structure for evaluation or handoff.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- Docker / Docker Compose
- Zod
- Swagger UI

## Features

- Create events
- List upcoming events
- Create bookings with Prisma transaction handling for ticket updates
- Fetch user bookings with event details
- Mark attendance using `booking_code`
- OpenAPI documentation at `/api-docs`
- Containerized local development and deployment support

## Project Structure

```text
src/
  config/
  controllers/
  routes/
  validators/
prisma/
  migrations/
  schema.prisma
swagger.yaml
Dockerfile
docker-compose.yml
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URL="mysql://root:root@localhost:3306/event_db"
```

For Docker Compose, the backend service uses:

```env
PORT=3000
DATABASE_URL="mysql://root:root@mysql:3306/event_db"
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MySQL with Docker

```bash
docker compose up -d mysql
```

### 3. Run Prisma generate and migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start the server

Development:

```bash
npm run dev
```

Production-style local run:

```bash
npm run build
npm start
```

## One-Command Run

Run the full project with backend + MySQL:

```bash
docker compose up --build
```

The API will be available at `http://localhost:3000` and Swagger UI at `http://localhost:3000/api-docs`.

## API Endpoints

- `POST /api/v1/events`
- `GET /api/v1/events`
- `POST /api/v1/bookings`
- `GET /api/v1/users/:id/bookings`
- `POST /api/v1/events/:id/attendance`
- `GET /health`

## Swagger Usage

Swagger UI is exposed at:

```text
/api-docs
```

Integration used in Express:

```ts
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load(path.resolve(process.cwd(), "swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## Docker

### Backend container

The `Dockerfile`:

- installs dependencies
- generates Prisma client
- builds TypeScript
- runs Prisma migrations on startup
- starts the production server

### Services in `docker-compose.yml`

- `mysql`: MySQL 8 database
- `backend`: Express + Prisma API container

