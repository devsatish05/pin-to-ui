# UI Comment System Architecture

## Project Overview
A full-stack web application for adding visual comments and feedback annotations on web pages.

## Tech Stack
- **Frontend**: TypeScript, Vite, SCSS
- **Backend**: Node.js, Express, TypeScript
- **ORM**: Prisma
- **Database**: SQLite (development) / PostgreSQL 16 (production)
- **Containerization**: Docker, Docker Compose

## Project Structure

```
pin-to-ui/
│
├── frontend/
│   ├── ui/
│   │   ├── index.html
│   │   ├── styles.scss
│   │   └── main.ts
│   │
│   ├── overlay/
│   │   ├── overlay.ts
│   │   └── overlay.scss
│   │
│   ├── components/
│   │   └── CommentList.ts
│   │
│   ├── shared/
│   │   ├── types.ts
│   │   ├── api-client.ts
│   │   └── variables.scss
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── comment.controller.ts
│   │   ├── services/
│   │   │   └── comment.service.ts
│   │   ├── routes/
│   │   │   └── comment.routes.ts
│   │   ├── middleware/
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── .env.docker.example
├── .gitignore
├── README.md
├── INSTRUCTIONS.md
└── architect.md
```

## Database Schema (Prisma)

### Comments Model
```prisma
model Comment {
  id            Int      @id @default(autoincrement())
  pageUrl       String   @map("page_url")
  content       String
  positionX     Int      @map("position_x")
  positionY     Int      @map("position_y")
  screenshotUrl String?  @map("screenshot_url")
  status        String   @default("open")
  priority      String   @default("medium")
  authorName    String?  @map("author_name")
  authorEmail   String?  @map("author_email")
  category      String   @default("general")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  resolution    String?
  assignedTo    String?  @map("assigned_to")

  @@map("comments")
}
```

## API Endpoints

### Comment Management
- `POST /api/comments` - Create new comment
- `GET /api/comments` - Get all comments
- `GET /api/comments/{id}` - Get comment by ID
- `GET /api/comments/page?url={url}` - Get comments by page URL
- `GET /api/comments/status/{status}` - Get comments by status
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

## Features

1. **Visual Pin System**: Click anywhere to add comment pins
2. **Rich Metadata**: Status, priority, category, author information
3. **Comment Lifecycle**: Open → In Progress → Resolved → Closed
4. **Priority Levels**: Low, Medium, High, Critical
5. **Categories**: Bug, Feature, Improvement, Question, General
6. **Responsive Design**: SCSS-based styling system with modern CSS features
7. **Type Safety**: Full TypeScript support
8. **REST API**: Complete CRUD operations
9. **Docker Support**: Containerized deployment
10. **CORS Enabled**: Cross-origin resource sharing
11. **Standalone Mode**: Frontend works independently with localStorage fallback
12. **Smart Modal Positioning**: Automatic viewport boundary detection prevents overflow
13. **Visual Mode Indicator**: Toggle button shows backend connection status

## Development Workflow

1. **Standalone Frontend** (no backend required):
   - Frontend: `npm run dev` (port 5173)
   - Storage: Browser localStorage
   - Mode Indicator: Orange toggle button with 📦 badge

2. **Local Development** (with SQLite):
   - Backend: `npm run dev` (port 8080)
   - Frontend: `npm run dev` (port 5173)
   - Database: SQLite (automatic)
   - Prisma Studio: `npm run prisma:studio`
   - Mode Indicator: Blue toggle button (connected)

3. **Production** (with PostgreSQL):
   - Backend: `npm start` with DATABASE_URL env variable
   - Database: PostgreSQL on port 5432

2. **Docker Deployment**:
   ```bash
   docker-compose up -d
   ```

3. **Production Build**:
   - Backend: `npm run build` (compiles TypeScript)
   - Frontend: `npm run build` (Vite build)
   - Database: `npm run prisma:generate && npm run prisma:migrate`

## Configuration

### Database
- **Development**: SQLite (file-based)
  - No setup required
  - File: `./prisma/dev.db`
  - Prisma Studio: `npm run prisma:studio`
- **Production**: PostgreSQL 16
  - Port: 5432
  - Database: ui_comment_db
  - User: postgres (configurable)
  - Connection via DATABASE_URL env variable

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Language**: TypeScript
- **ORM**: Prisma
- **Port**: 8080
- **Build Tool**: tsx (TypeScript execution)

### Frontend
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.3
- **Port**: 5173/5174 (dev), 80 (production)
- **Styling**: Modern SCSS with @use modules
- **Storage**: Dual-mode (Backend API / localStorage)
- **Modal System**: Smart viewport-aware positioning

## UI/UX Improvements

### Smart Modal Positioning
- Automatic viewport boundary detection
- Dynamic positioning (left/right/top/bottom)
- Prevents modal overflow at screen edges
- Maintains visibility for all pin locations

### Mode Indicators
- **Connected Mode**: Blue toggle button
- **Standalone Mode**: Orange button with 📦 badge
- Hover tooltips show current mode
- Automatic backend detection on load

### Modern SCSS Architecture
- `@use` modules instead of deprecated `@import`
- `color-mix()` instead of deprecated `darken()`
- Modular variable system
- No preprocessor warnings

## Security Considerations

- CORS configured for allowed origins
- Input validation on all endpoints
- PostgreSQL prepared statements (SQL injection protection)
- Environment variable configuration
- Global exception handling
- localStorage data scoped per page URL

## Completed Enhancements

- [x] Standalone mode with localStorage
- [x] Smart modal positioning
- [x] Modern SCSS architecture
- [x] Visual mode indicators
- [x] Dual database support (H2/PostgreSQL)

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] WebSocket for real-time updates
- [ ] Screenshot capture and upload
- [ ] Comment threading/replies
- [ ] Email notifications
- [ ] Export comments (CSV/PDF)
- [ ] Admin dashboard
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Mobile-responsive touch interactions
- [ ] Keyboard shortcuts
- [ ] Dark mode theme