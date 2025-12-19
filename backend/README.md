# UI Comment System - Backend

Spring Boot REST API backend for the UI Comment System. Provides endpoints for managing comments with CRUD operations, filtering, and status tracking.

## 🛠️ Technology Stack

- **Java**: 17+ (tested with Java 17 and Java 25)
- **Spring Boot**: 3.2.5
- **Spring Data JPA**: Database abstraction
- **H2 Database**: In-memory database for development
- **Maven**: Build and dependency management
- **JUnit 5**: Unit testing framework
- **Mockito**: Mocking framework for tests

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- (Optional) PostgreSQL 12+ for production

## 🚀 Quick Start

### 1. Build the Project

```bash
mvn clean install
```

### 2. Run the Application

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

### 3. Access H2 Console

Open `http://localhost:8080/h2-console` in your browser

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:ui_comment_db`
- Username: `sa`
- Password: (leave empty)

## 🧪 Running Tests

### Run All Tests

```bash
mvn test
```

### Run Specific Test Class

```bash
mvn test -Dtest=CommentServiceTest
mvn test -Dtest=CommentControllerIntegrationTest
```

### Test Coverage

- **21 tests** across 3 test classes
- **Service Layer Tests** (10 tests): Unit tests with mocked repository
- **Controller Integration Tests** (10 tests): Full Spring context with MockMvc
- **Application Context Test** (1 test): Verifies Spring Boot configuration

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api/comments
```

### Endpoints

#### Create Comment
```http
POST /api/comments
Content-Type: application/json

{
  "pageUrl": "http://example.com",
  "content": "This is a comment",
  "positionX": 100,
  "positionY": 200,
  "status": "OPEN",
  "priority": "MEDIUM",
  "category": "BUG",
  "authorName": "John Doe",
  "authorEmail": "john@example.com"
}
```

#### Get All Comments
```http
GET /api/comments
```

#### Get Comment by ID
```http
GET /api/comments/{id}
```

#### Get Comments by Page URL
```http
GET /api/comments/page?url={pageUrl}
```

#### Get Comments by Status
```http
GET /api/comments/status/{status}
```

Status values: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

#### Update Comment (Partial)
```http
PUT /api/comments/{id}
Content-Type: application/json

{
  "status": "RESOLVED",
  "priority": "HIGH"
}
```

#### Delete Comment
```http
DELETE /api/comments/{id}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/uicomment/
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java           # CORS configuration
│   │   │   ├── controller/
│   │   │   │   └── CommentController.java   # REST endpoints
│   │   │   ├── service/
│   │   │   │   └── CommentService.java      # Business logic
│   │   │   ├── repository/
│   │   │   │   └── CommentRepository.java   # JPA repository
│   │   │   ├── model/
│   │   │   │   └── Comment.java             # JPA entity
│   │   │   └── UiCommentApplication.java    # Main application
│   │   └── resources/
│   │       ├── application.properties       # Configuration
│   │       └── application-prod.properties  # Production config
│   └── test/
│       └── java/com/example/uicomment/
│           ├── controller/
│           │   └── CommentControllerIntegrationTest.java
│           ├── service/
│           │   └── CommentServiceTest.java
│           └── UiCommentApplicationTests.java
├── pom.xml
└── README.md
```

## ⚙️ Configuration

### Database Configuration

The default configuration uses H2 in-memory database. No setup required.

**application.properties:**
```properties
# H2 Database
spring.datasource.url=jdbc:h2:mem:ui_comment_db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### Production (PostgreSQL)

Create or edit `src/main/resources/application-prod.properties`:

```properties
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/ui_comment_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=false
```

Run with production profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Or package and run:
```bash
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### CORS Configuration

CORS is configured in `WebConfig.java` to allow all origins by default:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

**To restrict origins**, change `allowedOriginPatterns`:
```java
.allowedOriginPatterns("http://localhost:5173", "https://your-domain.com")
```

## 🏗️ Building for Production

### Create JAR

```bash
mvn clean package
```

The JAR will be created at `target/demo-0.0.1-SNAPSHOT.jar`

### Run JAR

```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Custom Port

```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=9090
```

## 🐛 Troubleshooting

### Tests Failing with Java 25

If you encounter Mockito/Byte Buddy errors with Java 25:

**Error:**
```
Byte Buddy could not instrument all classes
Java 25 (69) is not supported
```

**Solution:** Use integration tests instead of `@WebMvcTest`. The project uses `@SpringBootTest` with `@AutoConfigureMockMvc` for compatibility.

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

Or change the port in `application.properties`:
```properties
server.port=8081
```

### Database Connection Issues

**H2 Console not accessible:**
- Ensure `spring.h2.console.enabled=true` in properties
- Access at `http://localhost:8080/h2-console` (not `/h2`)

**PostgreSQL connection failed:**
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `application-prod.properties`
- Ensure database exists: `createdb ui_comment_db`

## 📚 API Documentation

For detailed API documentation with request/response examples, see the main [README.md](../README.md#-api-endpoints)

## 🤝 Contributing

1. Write tests for new features
2. Ensure all tests pass: `mvn test`
3. Follow Spring Boot best practices
4. Update this README for significant changes

## 📝 License

MIT License - see [LICENSE](../LICENSE) file for details
