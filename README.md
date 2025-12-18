# UI Comment System

A full-stack application for adding comments and feedback annotations directly on web pages. Built with TypeScript/Vite frontend and Java Spring Boot backend.

## 🚀 Features

- **Visual Commenting**: Click anywhere on a webpage to add comments with pin markers
- **Rich Metadata**: Categorize comments by type (Bug, Feature, Improvement, Question)
- **Priority Levels**: Set priority from Low to Critical
- **Status Tracking**: Track comment lifecycle (Open, In Progress, Resolved, Closed)
- **Standalone Library**: Can be integrated into any web application
- **RESTful API**: Complete backend API for comment management
- **MySQL Database**: Persistent storage for all comments
- **CORS Support**: Configured for cross-origin requests

## 📋 Prerequisites

### Backend
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Frontend
- Node.js 18+ and npm/yarn
- Modern web browser

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devsatish05/pin-to-ui.git
cd pin-to-ui
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE ui_comment_db;
```

### 3. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env if needed (default API URL is http://localhost:8080/api)

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

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
├── backend/
│   ├── src/main/java/com/example/uicomment/
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic
│   │   ├── repository/       # Data access
│   │   ├── model/            # JPA entities
│   │   ├── dto/              # Data transfer objects
│   │   ├── config/           # Configuration classes
│   │   └── exception/        # Exception handlers
│   └── pom.xml
│
├── frontend/
│   ├── ui/                   # Main UI components
│   ├── overlay/              # Overlay implementation
│   ├── components/           # Reusable components
│   ├── shared/               # Shared types and utilities
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Linting

```bash
cd frontend
npm run lint
npm run format
```

## 🐳 Docker Deployment

See `INSTRUCTIONS.md` for Docker deployment instructions.

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ui_comment_db
spring.datasource.username=root
spring.datasource.password=password

# CORS
cors.allowed.origins=http://localhost:5173,http://localhost:3000

# Server
server.port=8080
```

### Frontend Configuration

Edit `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_DEBUG=true
```

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
