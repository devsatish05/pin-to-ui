# UI Comment System - Frontend

TypeScript/Vite frontend library for adding visual comments and annotations to web pages. Can run standalone with localStorage or integrate with the backend API.

## 🛠️ Technology Stack

- **TypeScript**: Type-safe JavaScript
- **Vite**: Lightning-fast build tool
- **Axios**: HTTP client for API calls
- **SCSS**: Styling
- **Jest**: Unit testing framework
- **WebdriverIO**: E2E testing framework

## 📋 Prerequisites

- Node.js 16+ and npm
- Modern web browser

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Build for Production

```bash
npm run build
```

Built files will be in `dist/` directory.

## 🧪 Running Tests

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# Verbose output
npm test -- --verbose
```

### E2E Tests (WebdriverIO)

```bash
# Run E2E tests
npm run test:e2e
```

**Note:** Ensure both backend and frontend servers are running before E2E tests.

### Test Coverage

- **12 unit tests** all passing ✅
- **API Client Tests** (7 tests): CRUD operations, filtering
- **Type Validation Tests** (5 tests): TypeScript interfaces and enums
- **E2E Tests**: Configured for overlay interactions and API integration

## 📦 Integration

### Option 1: Build and Include in Your Project

```bash
npm run build
```

Copy files from `dist/` to your project:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/style.css">
</head>
<body>
  <!-- Your content -->
  
  <script type="module" src="path/to/ui-comment-overlay.js"></script>
  <script type="module">
    import { UICommentOverlay } from './path/to/ui-comment-overlay.js';
    
    new UICommentOverlay({
      apiBaseUrl: 'http://localhost:8080',
      enableDebug: true,
      position: 'bottom-right'
    });
  </script>
</body>
</html>
```

### Option 2: Direct Integration (Development)

```typescript
import { UICommentOverlay } from './overlay/overlay';
import './overlay/overlay.scss';

const overlay = new UICommentOverlay({
  apiBaseUrl: 'http://localhost:8080',
  enableDebug: true,
  position: 'bottom-right',
  theme: 'light',
  standaloneMode: false
});
```

### Configuration Options

```typescript
interface OverlayConfig {
  apiBaseUrl?: string;        // Backend API URL (default: http://localhost:8080)
  enableDebug?: boolean;      // Enable console logging (default: false)
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';   // UI theme (default: light)
  standaloneMode?: boolean;   // Use localStorage instead of API (default: false)
}
```

## 📁 Project Structure

```
frontend/
├── ui/
│   ├── index.html              # Demo page
│   ├── main.ts                 # Entry point
│   └── styles.scss             # Global styles
├── overlay/
│   ├── overlay.ts              # Main overlay implementation
│   └── overlay.scss            # Overlay styles
├── shared/
│   ├── api-client.ts           # API integration
│   ├── types.ts                # TypeScript interfaces
│   └── variables.scss          # SCSS variables
├── components/
│   └── CommentList.ts          # Reusable components
├── __tests__/
│   ├── api-client.test.ts      # API client tests
│   └── types.test.ts           # Type validation tests
├── __mocks__/
│   └── styleMock.js            # Style mock for Jest
├── test/
│   └── specs/
│       ├── overlay.e2e.ts      # Overlay E2E tests
│       └── api.e2e.ts          # API E2E tests
├── package.json
├── vite.config.ts
├── jest.config.js
├── wdio.conf.ts
├── tsconfig.json
└── README.md
```

## 🎨 Features

### 1. Add Comments

Click anywhere on the page to place a comment pin. Fill in the form:
- **Content**: Description of the comment
- **Category**: BUG, FEATURE, IMPROVEMENT, QUESTION
- **Priority**: LOW, MEDIUM, HIGH, CRITICAL
- **Author Info**: Name and email

### 2. View Comments

Click on any pin to view comment details including:
- Author information
- Timestamp
- Status
- Priority
- Category

### 3. Update Comments

From the pin details modal:
- Change status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- Update priority
- Modify other fields

### 4. Delete Comments

Remove comments from the details modal.

### 5. Filter Comments

View comments by page URL or status.

### 6. Standalone Mode

Enable standalone mode to work without backend:

```typescript
new UICommentOverlay({
  standaloneMode: true
});
```

Comments are saved to browser's localStorage.

## 🔧 Development

### Project Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npx tsc --noEmit

# Lint (if configured)
npm run lint
```

### Adding New Features

1. **Create new component** in `components/` or extend `overlay.ts`
2. **Add types** to `shared/types.ts`
3. **Write tests** in `__tests__/`
4. **Update styles** in respective `.scss` files

### API Client Usage

```typescript
import ApiClient from './shared/api-client';

const client = new ApiClient('http://localhost:8080');

// Create comment
const comment = await client.createComment({
  pageUrl: window.location.href,
  content: 'Comment text',
  positionX: 100,
  positionY: 200,
  status: CommentStatus.OPEN,
  priority: CommentPriority.MEDIUM,
  category: CommentCategory.BUG,
  authorName: 'John Doe',
  authorEmail: 'john@example.com'
});

// Get all comments
const comments = await client.getAllComments();

// Update comment
await client.updateComment(commentId, {
  status: CommentStatus.RESOLVED
});

// Delete comment
await client.deleteComment(commentId);
```

## 🎯 TypeScript Types

### Comment Interface

```typescript
interface Comment {
  id?: number;
  pageUrl: string;
  content: string;
  positionX: number;
  positionY: number;
  status?: CommentStatus;
  priority?: CommentPriority;
  category?: CommentCategory;
  authorName?: string;
  authorEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  screenshotUrl?: string;
  resolution?: string;
  assignedTo?: string;
}
```

### Enums

```typescript
enum CommentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

enum CommentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

enum CommentCategory {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  IMPROVEMENT = 'IMPROVEMENT',
  QUESTION = 'QUESTION'
}
```

## 🐛 Troubleshooting

### Build Issues

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
npx tsc --noEmit
```

### Test Issues

**Jest cannot find modules:**
```bash
npm install --save-dev @types/jest
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["vite/client", "jest"]
  }
}
```

**Tests failing:**
- Ensure all enum values are imported
- Check mock implementations in `__mocks__/`
- Verify axios is properly mocked

### CORS Issues

If you get CORS errors when connecting to backend:

1. Ensure backend CORS is configured (see backend README)
2. Check `apiBaseUrl` includes protocol: `http://localhost:8080`
3. Verify backend is running on the correct port

### Overlay Not Appearing

1. Check browser console for errors
2. Verify scripts are loaded: inspect Network tab
3. Ensure CSS is included
4. Try toggling with the button in bottom-right corner

## 📊 Testing Guide

For comprehensive testing documentation including:
- Test organization
- Writing new tests
- Mocking strategies
- E2E test setup
- Coverage requirements

See [../TESTING.md](../TESTING.md)

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

1. Build the project:
```bash
npm run build
```

2. Deploy `dist/` directory to your hosting provider

3. Configure environment variables for production API URL

### CDN Integration

Upload `dist/` files to CDN and include in your HTML:

```html
<link rel="stylesheet" href="https://cdn.example.com/ui-comment/style.css">
<script type="module" src="https://cdn.example.com/ui-comment/overlay.js"></script>
```

## 🤝 Contributing

1. Write tests for new features
2. Ensure all tests pass: `npm test`
3. Follow TypeScript best practices
4. Update this README for significant changes
5. Maintain type safety - no `any` types without good reason

## 📝 License

MIT License - see [LICENSE](../LICENSE) file for details

## 🔗 Related Documentation

- [Main README](../README.md) - Project overview
- [Backend README](../backend/README.md) - Backend API documentation
- [TESTING.md](../TESTING.md) - Comprehensive testing guide
