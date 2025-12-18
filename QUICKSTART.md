# 🚀 Quick Start Guide

Get the UI Comment System running in **under 5 minutes**!

## ✅ What You Need

- ✅ Java 17 (check: `java -version`)
- ✅ Maven (install: `brew install maven`)
- ✅ Node.js 18+ (check: `node --version`)

## 🎯 Super Quick Start (Demo Mode)

### 1️⃣ Start Backend (No Database Setup!)

```bash
cd backend

# Install Maven if not present
brew install maven

# Build and run
mvn clean spring-boot:run
```

✅ Backend runs on: **http://localhost:8080**  
✅ H2 Console: **http://localhost:8080/h2-console**

### 2️⃣ Start Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend runs on: **http://localhost:5173**

### 3️⃣ Try It Out!

1. Open **http://localhost:5173** in your browser
2. Click the **💬 button** in bottom-right corner
3. Click anywhere to add a comment
4. Fill the form and submit
5. See your comment pin appear!

---

## 🗄️ Database Info

### H2 Console Access (Current Setup)

**URL:** http://localhost:8080/h2-console

**Login:**
- JDBC URL: `jdbc:h2:mem:ui_comment_db`
- Username: `sa`
- Password: (leave empty)

You can view and query the `comments` table directly!

### Why H2?

- ✅ **Zero setup** - works instantly
- ✅ **Perfect for demos** - no database installation
- ✅ **Built-in console** - inspect data visually
- ✅ **Fast** - runs in memory

### Data Note

⚠️ **Data resets on restart** - H2 is in-memory. For persistent data, switch to PostgreSQL (see [DATABASE_SETUP.md](./DATABASE_SETUP.md))

---

## 📡 API Testing

### Create a Comment

```bash
curl -X POST http://localhost:8080/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "http://example.com",
    "content": "Test comment",
    "positionX": 100,
    "positionY": 200,
    "category": "BUG",
    "priority": "HIGH"
  }'
```

### Get All Comments

```bash
curl http://localhost:8080/api/comments
```

### Get Comments for a Page

```bash
curl "http://localhost:8080/api/comments/page?url=http://example.com"
```

---

## 🐳 Docker Quick Start

**Prerequisites:** Docker and Docker Compose installed

```bash
# Start everything (PostgreSQL + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

---

## 🔧 Troubleshooting

### Backend Won't Start

**Problem:** `mvn: command not found`
```bash
brew install maven
```

**Problem:** `java: command not found`
```bash
brew install openjdk@17
```

**Problem:** Port 8080 already in use
```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>
```

### Frontend Won't Start

**Problem:** `npm: command not found`
```bash
brew install node
```

**Problem:** Port 5173 already in use
```bash
# Kill the process or change port in vite.config.ts
lsof -i :5173
kill -9 <PID>
```

**Problem:** Dependencies fail to install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't Access H2 Console

**Verify settings in application.properties:**
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

**Try:**
- URL: http://localhost:8080/h2-console
- Clear browser cache
- Check backend logs for errors

---

## 📚 Next Steps

1. ✅ **Explore the app** - Try adding different comment types
2. ✅ **Check H2 Console** - See data in the database
3. ✅ **Test the API** - Use curl or Postman
4. ✅ **Read the docs:**
   - [README.md](./README.md) - Full documentation
   - [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Switch to PostgreSQL
   - [architect.md](./architect.md) - Architecture details

---

## 🎨 Customization

### Change Comment Button Position

Edit `frontend/ui/main.ts`:
```typescript
const config = {
  position: 'bottom-right' // or 'top-right', 'bottom-left', 'top-left'
};
```

### Change Theme

Edit `frontend/shared/variables.scss` to customize colors.

### Change Port

**Backend:** Edit `application.properties`
```properties
server.port=8080
```

**Frontend:** Edit `vite.config.ts`
```typescript
server: {
  port: 5173
}
```

---

## 💡 Pro Tips

1. **Keep both terminals open** to see live logs
2. **Use H2 Console** to inspect data while testing
3. **Frontend auto-reloads** on code changes (Vite HMR)
4. **Backend auto-reloads** with Spring Boot DevTools
5. **Check browser console** for frontend errors
6. **Check terminal** for backend errors

---

## ✨ Features to Try

- ✅ Add comments with different priorities (Low, Medium, High, Critical)
- ✅ Try different categories (Bug, Feature, Improvement, Question)
- ✅ Add author name and email
- ✅ Click on pins to view comment details
- ✅ Test on different pages (change URL in browser)
- ✅ Use H2 console to query comments directly

---

## 🤝 Need Help?

- 📖 Read [INSTRUCTIONS.md](./INSTRUCTIONS.md) for detailed setup
- 🐛 Check [GitHub Issues](https://github.com/devsatish05/pin-to-ui/issues)
- 📧 Open an issue if you find a bug

---

**Ready to start?** Just run:

```bash
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2  
cd frontend && npm install && npm run dev
```

Then open **http://localhost:5173** and start commenting! 🎉
