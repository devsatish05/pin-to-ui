# UI Comment System Architecture

## Project Overview
A full-stack web application for adding visual comments and feedback annotations on web pages.

## Tech Stack
- **Frontend**: TypeScript, Vite, SCSS
- **Backend**: Java 17, Spring Boot, Maven
- **Database**: H2 (in-memory, default) / PostgreSQL 16 (production)
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
│   ├── src/main/java/com/example/uicomment/
│   │   ├── controller/
│   │   │   └── CommentController.java
│   │   ├── service/
│   │   │   └── CommentService.java
│   │   ├── repository/
│   │   │   └── CommentRepository.java
│   │   ├── model/
│   │   │   └── Comment.java
│   │   ├── dto/
│   │   │   ├── CreateCommentRequest.java
│   │   │   ├── CommentResponse.java
│   │   │   └── UpdateCommentRequest.java
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── exception/
│   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ErrorResponse.java
│   │   └── UiCommentApplication.java
│   │
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-dev.properties
│   │
│   ├── src/test/resources/
│   │   └── application-test.properties
│   │
│   ├── pom.xml
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── .env.docker.example
├── .gitignore
├── README.md
├── INSTRUCTIONS.md
└── architect.md
```

## Database Schema

### Comments Table
```sql
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    page_url VARCHAR(2048) NOT NULL,
    content TEXT NOT NULL,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    screenshot_url VARCHAR(2048),
    status VARCHAR(50),
    priority VARCHAR(50),
    author_name VARCHAR(255),
    author_email VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolution VARCHAR(1000),
    assigned_to VARCHAR(255)
);
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
6. **Responsive Design**: SCSS-based styling system
7. **Type Safety**: Full TypeScript support
8. **REST API**: Complete CRUD operations
9. **Docker Support**: Containerized deployment
10. **CORS Enabled**: Cross-origin resource sharing

## Development Workflow

1. **Local Development** (with H2):
   - Backend: `mvn spring-boot:run` (port 8080)
   - Frontend: `npm run dev` (port 5173)
   - Database: H2 in-memory (no setup needed)
   - H2 Console: http://localhost:8080/h2-console

1. **Production** (with PostgreSQL):
   - Backend: `mvn spring-boot:run -Dspring-boot.run.profiles=prod`
   - Database: PostgreSQL on port 5432

2. **Docker Deployment**:
   ```bash
   docker-compose up -d
   ```

3. **Production Build**:
   - Backend: `mvn clean package`
   - Frontend: `npm run build`

## Configuration

### Database
- **Default (Demo/Dev)**: H2 in-memory database
  - No setup required
  - Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:ui_comment_db`
- **Production**: PostgreSQL 16
  - Port: 5432
  - Database: ui_comment_db
  - User: postgres (configurable)
  - Profile: `prod`

### Backend
- **Framework**: Spring Boot 3.2.1
- **Java**: 17
- **Port**: 8080
- **Build Tool**: Maven

### Frontend
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.3
- **Port**: 5173 (dev), 80 (production)
- **Styling**: SCSS

## Security Considerations

- CORS configured for allowed origins
- Input validation on all endpoints
- PostgreSQL prepared statements (SQL injection protection)
- Environment variable configuration
- Global exception handling

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] WebSocket for real-time updates
- [ ] Screenshot capture and upload
- [ ] Comment threading/replies
- [ ] Email notifications
- [ ] Export comments (CSV/PDF)
- [ ] Admin dashboard
- [ ] API documentation (Swagger/OpenAPI)