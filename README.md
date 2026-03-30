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

## Deployment

### Railway

1. Create a MySQL database service.
2. Create a backend service from this repo.
3. Set environment variables:

```env
PORT=3000
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/event_db
```

4. Build command:

```bash
npm install && npm run prisma:generate && npm run build
```

5. Start command:

```bash
npm run prisma:migrate && npm start
```

### Render

1. Provision a MySQL-compatible database or external MySQL instance.
2. Create a Web Service from this repo.
3. Set environment variables:

```env
PORT=3000
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/event_db
```

4. Build command:

```bash
npm install && npm run prisma:generate && npm run build
```

5. Start command:

```bash
npm run prisma:migrate && npm start
```

### VPS

1. Install Docker and Docker Compose on the server.
2. Copy the project and set production values in `.env`.
3. Start the stack:

```bash
docker compose up --build -d
```

4. Expose port `3000` through your firewall or reverse proxy.

## Small Production Improvements

- Add a shared error-handling middleware so all controllers return a consistent error shape.
- Move business logic into `services/` to keep controllers thin and easier to test.
- Add request logging, rate limiting, and security headers for public deployments.
- Add unique attendance constraints if each booking should only be checked in once.
- Add automated tests for booking race conditions and attendance edge cases.
