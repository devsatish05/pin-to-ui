# UI Comment System

A full-stack application for adding comments and feedback annotations directly on web pages. Built with TypeScript/Vite frontend and Spring Boot/Java backend.

## 🚀 Features

- **Visual Commenting**: Click anywhere on a webpage to add comments with pin markers
- **Rich Metadata**: Categorize comments by type (Bug, Feature, Improvement, Question)
- **Priority Levels**: Set priority from Low to Critical
- **Status Tracking**: Track comment lifecycle (Open, In Progress, Resolved, Closed)
- **Update & Delete**: Modify or remove comments with modal interface
- **Standalone Library**: Can be integrated into any web application
- **Independent Frontend**: Works without backend using localStorage
- **RESTful API**: Complete backend API for comment management
- **H2 Database**: In-memory database for development (PostgreSQL ready for production)
- **CORS Support**: Configured for cross-origin requests
- **TypeScript**: Full type safety across frontend and backend
- **Comprehensive Testing**: Unit and integration tests for both frontend and backend

## 📋 Prerequisites

### Backend
- Java 17 or higher (tested with Java 17 and Java 25)
- Maven 3.6+
- (Optional) PostgreSQL 12+ for production use

### Frontend
- Node.js 16+ and npm
- Modern web browser

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devsatish05/pin-to-ui.git
cd pin-to-ui
```

### 2. Backend Setup

```bash
cd backend

# Build and run tests
mvn clean install

# Start development server
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**🎉 H2 Console Available:** Access the in-memory database console at `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:ui_comment_db`
- Username: `sa`
- Password: (leave empty)

For detailed backend setup and configuration, see [backend/README.md](./backend/README.md)

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

The frontend will start on `http://localhost:5173`

**🎉 Frontend works independently!** Comments are saved to localStorage if backend is not running.

For detailed frontend setup, testing, and integration guide, see [frontend/README.md](./frontend/README.md)

## 📖 Usage

### For Development/Testing

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Click the 💬 button in the bottom-right corner
4. Click anywhere on the page to add a comment
5. Fill in the comment form and submit
6. View your comment pins on the page

### Integrating into Your Application

#### Option 1: Build and Include

```bash
cd frontend
npm run build
```

Then include the generated files from `frontend/dist/` in your project:

```html
<link rel="stylesheet" href="path/to/ui-comment-overlay.css">
<script src="path/to/ui-comment-overlay.umd.js"></script>

<script>
  new UICommentOverlay({
    apiBaseUrl: 'http://localhost:8080/api',
    enableDebug: true,
    position: 'bottom-right'
  });
</script>
```

#### Option 2: NPM Package (if published)

```bash
npm install ui-comment-overlay
```

```typescript
import { UICommentOverlay } from 'ui-comment-overlay';
import 'ui-comment-overlay/style.css';

const overlay = new UICommentOverlay({
  apiBaseUrl: 'http://your-api-url/api',
  theme: 'light',
  position: 'bottom-right'
});
```

## 🔌 API Endpoints

### Comments

- `POST /api/comments` - Create a new comment
- `GET /api/comments` - Get all comments
- `GET /api/comments/{id}` - Get comment by ID
- `GET /api/comments/page?url={pageUrl}` - Get comments for a specific page
- `GET /api/comments/status/{status}` - Get comments by status
- `PUT /api/comments/{id}` - Update a comment
- `DELETE /api/comments/{id}` - Delete a comment

### Example Request

```bash
curl -X POST http://localhost:8080/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "http://example.com",
    "content": "This button needs better contrast",
    "positionX": 450,
    "positionY": 320,
    "category": "BUG",
    "priority": "HIGH",
    "authorName": "John Doe"
  }'
```

## 🏗️ Project Structure

```
pin-to-ui/
├── backend/                                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/example/uicomment/
│   │   │   ├── controller/                    # REST controllers
│   │   │   ├── service/                       # Business logic
│   │   │   ├── repository/                    # JPA repositories
│   │   │   ├── model/                         # JPA entities
│   │   │   └── config/                        # Configuration (CORS, etc.)
│   │   └── test/java/                         # Unit & integration tests
│   ├── pom.xml
│   └── README.md                              # Backend documentation
│
├── frontend/                                   # Vite + TypeScript Frontend
│   ├── ui/                                    # Main UI entry point
│   ├── overlay/                               # Comment overlay implementation
│   ├── components/                            # Reusable components
│   ├── shared/                                # Types, API client, utilities
│   ├── __tests__/                             # Jest unit tests
│   ├── __mocks__/                             # Test mocks
│   ├── test/specs/                            # WDIO E2E tests
│   ├── package.json
│   ├── jest.config.js
│   ├── wdio.conf.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md                              # Frontend documentation
│
├── TESTING.md                                  # Comprehensive testing guide
└── README.md                                   # This file
```

## 🧪 Testing

### Backend Tests (Java/Spring Boot)

```bash
cd backend
mvn test
```

**Test Coverage:**
- ✅ 21 tests passing
- Service layer tests (10 tests)
- Controller integration tests (10 tests)
- Application context test (1 test)

### Frontend Tests (Jest + TypeScript)

```bash
cd frontend
npm test
```

**Test Coverage:**
- ✅ 12 tests passing
- API client tests (7 tests)
- Type validation tests (5 tests)
- WDIO E2E tests configured

### Comprehensive Testing Guide

For detailed testing documentation, troubleshooting, and best practices, see [TESTING.md](./TESTING.md)

## 🔧 Configuration

### Backend Configuration

**Default (H2 - No setup needed):**
```properties
# H2 In-Memory Database (default)
spring.datasource.url=jdbc:h2:mem:ui_comment_db
spring.h2.console.enabled=true
# Access H2 Console: http://localhost:8080/h2-console
```

**Production (PostgreSQL):**

Edit `backend/src/main/resources/application.properties`:
```properties
# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/ui_comment_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

**CORS Configuration:**

The backend is configured to accept requests from any origin by default. To restrict:

Edit `backend/src/main/java/com/example/uicomment/config/WebConfig.java`:
```java
registry.addMapping("/**")
    .allowedOriginPatterns("http://localhost:5173") // Specific origin
    .allowedMethods("GET", "POST", "PUT", "DELETE")
    .allowCredentials(true);
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:8080` by default.

To change the API URL, edit `frontend/ui/main.ts`:
```typescript
const overlay = new UICommentOverlay({
  apiBaseUrl: 'http://your-api-url:port',
  enableDebug: true,
  position: 'bottom-right'
});
```

For detailed configuration options, see package-specific README files:
- [Backend Configuration](./backend/README.md)
- [Frontend Configuration](./frontend/README.md)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- Vite for the lightning-fast frontend build tool
- TypeScript for type safety
