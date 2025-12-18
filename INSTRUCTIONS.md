# Setup Instructions

## Quick Start Guide

Follow these steps to get the UI Comment System up and running.

---

## Prerequisites Installation

> **Note:** PostgreSQL installation is **optional**. The application uses H2 in-memory database by default for easy demo. See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for switching to PostgreSQL.

### 1. Install Java 17

**macOS (using Homebrew):**
```bash
brew install openjdk@17
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

**Windows:**
Download from [Oracle](https://www.oracle.com/java/technologies/downloads/#java17) or use [SDKMAN](https://sdkman.io/)

Verify installation:
```bash
java -version
```

### 2. Install Maven

**macOS:**
```bash
brew install maven
```

**Ubuntu/Debian:**
```bash
sudo apt install maven
```

**Windows:**
Download from [Apache Maven](https://maven.apache.org/download.cgi)

Verify installation:
```bash
mvn -version
```

### 3. Install PostgreSQL (Optional - For Production)

> **Skip this step for demo!** H2 database is used by default.

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

Verify installation:
```bash
psql --version
```

### 4. Install Node.js

**macOS:**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

**Windows:**
Download from [Node.js](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

## Project Setup

### Step 1: Database Configuration

> **For Demo:** Skip to Step 2! H2 database requires no configuration.
> 
> **For Production:** Follow these PostgreSQL setup steps.

1. Login to PostgreSQL:nfiguration

1. Login to PostgreSQL:
```bash
# macOS/Linux
sudo -u postgres psql

# Windows (as postgres user)
psql -U postgres
```

2. Create database:
```sql
CREATE DATABASE ui_comment_db;
\q
```

3. (Optional) Create dedicated user:
```sql
# Login again
sudo -u postgres psql

# Create user and grant privileges
CREATE USER uicomment WITH PASSWORD 'your_secure_password';
### Step 2: Backend Configuration

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies and build:
DB_NAME=ui_comment_db
```

4. Install dependencies and build:
```bash
mvn clean install
```

5. Run the application:
```bash
mvn spring-boot:run
```

Or for production:
```bash
mvn clean package
java -jar target/ui-comment-backend-1.0.0.jar
```

**Expected Output:**
```
Started UiCommentApplication in X.XXX seconds
```

Backend should now be running on `http://localhost:8080`

### Step 3: Frontend Configuration

1. Navigate to frontend directory:
**Expected Output:**
```
Started UiCommentApplication in X.XXX seconds
```

Backend should now be running on `http://localhost:8080`

**🎉 H2 Database Console:** Access at `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:ui_comment_db`
- Username: `sa`
- Password: (leave empty)

### Step 3: Frontend Configuration

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` if needed:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_DEBUG=true
```

5. Start development server:
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## Testing the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Click the 💬 button in the bottom-right corner
3. Click anywhere on the page to add a comment
4. Fill in the form and submit
5. Your comment should appear as a pin on the page

---

## Production Build

### Backend

```bash
cd backend
mvn clean package
java -jar target/ui-comment-backend-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist/`

---

## Docker Deployment (Optional)

### Using Docker Compose

1. Make sure Docker and Docker Compose are installed

2. Start all services:
```bash
docker-compose up -d
```

3. Stop services:
```bash
docker-compose down
```

### Individual Docker Containers

**Backend:**
```bash
cd backend
docker build -t ui-comment-backend .
docker run -p 8080:8080 --env-file .env ui-comment-backend
```

**Frontend:**
```bash
cd frontend
docker build -t ui-comment-frontend .
docker run -p 5173:5173 ui-comment-frontend
```

---

## Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

**Problem:** PostgreSQL connection refused
- Check if PostgreSQL is running: `brew services list` (macOS) or `systemctl status postgresql` (Linux)
- Verify credentials in `.env` file
- Check PostgreSQL is listening on port 5432: `netstat -an | grep 5432`
- Try connecting manually: `psql -U postgres -d ui_comment_db`

**Problem:** Maven build fails
- Clear Maven cache: `mvn clean`
- Delete `~/.m2/repository` and rebuild

### Frontend Issues

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

**Problem:** Port 5173 already in use
- Kill the process or change port in `vite.config.ts`

**Problem:** API calls failing (CORS errors)
- Check backend is running on port 8080
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check CORS configuration in backend `application.properties`

---

## Environment Profiles

### Development
```bash
# Backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend
npm run dev
```

### Production
```bash
# Backend
java -jar target/ui-comment-backend-1.0.0.jar --spring.profiles.active=prod

# Frontend
npm run build
npm run preview
```

---

## Database Migration

If you need to reset the database:

```sql
DROP DATABASE ui_comment_db;
CREATE DATABASE ui_comment_db;
```

The application will automatically create tables on startup.

---

## Useful Commands

### Backend
- `mvn clean` - Clean build artifacts
- `mvn compile` - Compile source code
- `mvn test` - Run tests
- `mvn package` - Create JAR file
- `mvn spring-boot:run` - Run application

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

---

## Next Steps

1. Explore the API documentation at `http://localhost:8080/swagger-ui.html` (if Swagger is added)
2. Integrate the overlay into your existing applications
3. Customize styling in `frontend/shared/variables.scss`
4. Add authentication/authorization as needed
5. Set up CI/CD pipeline for automated deployments

---

## Support

For issues or questions:
- Check the [README.md](./README.md) for more information
- Open an issue on GitHub
- Review application logs for error details
