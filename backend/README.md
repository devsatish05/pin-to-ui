# UI Comment Backend

Express + TypeScript backend for the UI Comment System.

## Tech Stack

- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### Installation

```bash
npm install
```

### Database Setup

1. Create PostgreSQL database:
```bash
createdb uicomment
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials

4. Run Prisma migrations:
```bash
npm run prisma:migrate
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:8080`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Comments

- `GET /api/comments?pageUrl={url}` - Get all comments for a page
- `GET /api/comments/:id` - Get comment by ID
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Health Check

- `GET /health` - Server health status

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API routes
├── middleware/      # Express middleware
└── index.ts         # Application entry point
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run lint` - Lint code
- `npm run format` - Format code
