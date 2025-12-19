# Testing Guide

## Backend Tests (Java/Spring Boot)

### Prerequisites

**Important**: Tests require Java 17. If you're using Java 25, you may encounter Mockito compatibility issues with `@WebMvcTest`. Use Java 17 for running tests:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### Running Unit Tests

```bash
cd backend
mvn test
```

### Running Tests with Coverage

```bash
mvn test jacoco:report
```

Coverage report will be available at `target/site/jacoco/index.html`

### Test Structure

- **Controller Tests** (`CommentControllerTest.java`): Tests REST API endpoints using MockMvc
- **Service Tests** (`CommentServiceTest.java`): Tests business logic layer with mocked repository
- **Application Tests** (`UiCommentApplicationTests.java`): Tests Spring context loading

### Test Coverage

The backend tests cover:
- ✅ Creating comments
- ✅ Retrieving all comments
- ✅ Getting comment by ID
- ✅ Getting comments by page URL
- ✅ Getting comments by status
- ✅ Updating comments (partial updates)
- ✅ Deleting comments
- ✅ Error handling (404 cases)

## Frontend Tests (TypeScript/Jest/WDIO)

### Prerequisites

```bash
cd frontend
npm install
```

### Running Unit Tests (Jest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Coverage report will be in `coverage/lcov-report/index.html`

### Running E2E Tests (WebdriverIO)

**Important**: Start backend and frontend servers before running E2E tests!

```bash
# Terminal 1: Start backend
cd backend
java -jar target/demo-0.0.1-SNAPSHOT.jar

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Run E2E tests
cd frontend
npm run test:e2e
```

### Test Structure

**Unit Tests** (`__tests__/`)
- `api-client.test.ts`: Tests API client methods
- `types.test.ts`: Tests TypeScript type definitions

**E2E Tests** (`test/specs/`)
- `overlay.e2e.ts`: Tests UI overlay functionality
- `api.e2e.ts`: Tests API integration

### E2E Test Coverage

The E2E tests cover:
- ✅ Page loading and overlay initialization
- ✅ Toggle button functionality
- ✅ Comment modal opening/closing
- ✅ Form validation
- ✅ Creating comment pins
- ✅ Viewing pin details
- ✅ API integration (CRUD operations)
- ✅ User interactions

## Running All Tests

### Backend Only
```bash
cd backend && mvn clean test
```

### Frontend Only
```bash
cd frontend && npm test && npm run test:e2e
```

### Complete Test Suite

```bash
# Terminal 1: Start backend
cd backend && mvn clean package -DskipTests && java -jar target/demo-0.0.1-SNAPSHOT.jar

# Terminal 2: Start frontend  
cd frontend && npm run dev

# Terminal 3: Run backend tests
cd backend && mvn test

# Terminal 4: Run frontend tests
cd frontend && npm test && npm run test:e2e
```

## Test Reports

### Backend
- Surefire reports: `backend/target/surefire-reports/`
- JaCoCo coverage: `backend/target/site/jacoco/index.html`

### Frontend
- Jest coverage: `frontend/coverage/lcov-report/index.html`
- WDIO reports: Console output

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Run backend tests
        run: cd backend && mvn clean test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run unit tests
        run: cd frontend && npm test
      - name: Start services and run E2E tests
        run: |
          cd backend && mvn clean package -DskipTests
          java -jar backend/target/demo-0.0.1-SNAPSHOT.jar &
          cd frontend && npm run dev &
          sleep 10
          npm run test:e2e
```

## Troubleshooting

### E2E Tests Failing
- Ensure backend is running on port 8080
- Ensure frontend is running on port 5173
- Check Chrome/Chromedriver compatibility
- Run tests with `--headless=false` to see browser

### Unit Tests Failing
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- For backend: `mvn clean install`
- Check for port conflicts

### Coverage Issues
- Ensure all test files follow naming conventions (*.test.ts, *.spec.ts)
- Check jest.config.js coverage paths
- For backend: Add JaCoCo plugin to pom.xml

## Best Practices

1. **Write tests before fixing bugs** (TDD approach)
2. **Keep tests isolated** - no dependencies between tests
3. **Use meaningful test names** - describe what is being tested
4. **Mock external dependencies** - API calls, database, etc.
5. **Aim for high coverage** - minimum 70% for critical paths
6. **Run tests frequently** - before commits and in CI/CD
