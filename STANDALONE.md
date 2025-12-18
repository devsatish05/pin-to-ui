# Frontend Standalone Mode

The UI Comment Overlay can now run **completely independently** without requiring the backend server!

## 🎯 Features

- ✅ **No Backend Required** - Works out of the box
- ✅ **Automatic Fallback** - Tries backend, falls back to localStorage
- ✅ **LocalStorage Persistence** - Comments saved per page URL
- ✅ **Seamless Switch** - Automatically uses backend when available

## 🚀 Running Frontend Only

```bash
cd frontend
npm install
npm run dev
```

**Frontend will start on:** http://localhost:5173 (or 5174 if 5173 is in use)

## 💾 How It Works

### With Backend (Normal Mode)
1. Frontend tries to connect to backend
2. Comments are saved to PostgreSQL/H2
3. Comments sync across users

### Without Backend (Standalone Mode)
1. Frontend detects backend is unavailable
2. Switches to standalone mode automatically
3. Comments saved to browser's localStorage
4. Comments persist per page URL
5. Works great for demos!

## 🔧 Modes Explained

### Standalone Mode (Current)
- No backend needed
- Comments saved in browser localStorage
- Perfect for:
  - Quick demos
  - UI development
  - Testing without backend
  - Offline development

### Connected Mode
- Backend available at http://localhost:8080
- Comments saved to database
- Multiple users can collaborate
- Data persists across sessions

## 📝 Testing Standalone Mode

1. **Start frontend only:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open in browser:**
   http://localhost:5173

3. **Add comments:**
   - Click 💬 button
   - Click anywhere to add comment
   - Fill form and submit

4. **Verify localStorage:**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Look for keys starting with `ui-comments-`

5. **Check console:**
   - Should see: "Running in standalone mode (backend not available)"

## 🔄 Switching to Connected Mode

Start the backend:

```bash
# In another terminal
cd backend
mvn spring-boot:run
```

The frontend will automatically:
1. Detect backend is available
2. Switch to connected mode
3. Use database for new comments
4. Keep localStorage as fallback

## 🗂️ Data Storage

### LocalStorage Structure

```javascript
// Key format
"ui-comments-{pageUrl}"

// Value format
[
  {
    "id": 1702897654321,
    "pageUrl": "http://localhost:5173/",
    "content": "Test comment",
    "positionX": 450,
    "positionY": 320,
    "category": "BUG",
    "priority": "HIGH",
    "status": "OPEN",
    "createdAt": "2025-12-18T...",
    "updatedAt": "2025-12-18T..."
  }
]
```

### Clearing Data

**Clear localStorage data:**
```javascript
// In browser console
localStorage.clear()

// Or clear specific page
localStorage.removeItem('ui-comments-http://localhost:5173/')
```

## 🎨 Configuration

Edit `frontend/.env`:

```env
# API URL (optional in standalone mode)
VITE_API_BASE_URL=http://localhost:8080/api

# Enable debug logging
VITE_ENABLE_DEBUG=true
```

## 📊 Comparison

| Feature | Standalone Mode | Connected Mode |
|---------|----------------|----------------|
| **Backend Required** | ❌ No | ✅ Yes |
| **Setup** | None | Start backend |
| **Data Storage** | localStorage | Database (H2/PostgreSQL) |
| **Data Persistence** | Per browser | Cross-browser |
| **Multi-user** | ❌ No | ✅ Yes |
| **Offline** | ✅ Yes | ❌ No |
| **Best For** | Demos, Testing | Production |

## 🐛 Troubleshooting

### Frontend Won't Start

**Problem:** `npm: command not found`
```bash
brew install node
```

**Problem:** Port in use
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or change port in vite.config.ts
```

### Comments Not Saving

**Check console for errors:**
- F12 > Console
- Look for "[UICommentOverlay]" messages

**Verify localStorage:**
- F12 > Application > Local Storage
- Check for `ui-comments-*` keys

**Clear and retry:**
```javascript
localStorage.clear()
// Refresh page and try again
```

### Backend Connection Issues

**Verify backend status:**
```bash
curl http://localhost:8080/api/comments
```

**If backend is down:**
- Frontend automatically uses localStorage
- Console shows: "Running in standalone mode"
- Everything still works!

## 💡 Development Tips

1. **Quick Demo Mode:**
   - Just run frontend
   - No backend setup needed
   - Great for UI testing

2. **Full Stack Development:**
   - Run both frontend and backend
   - Get real-time database updates
   - Test full integration

3. **Debugging:**
   - Set `VITE_ENABLE_DEBUG=true` in `.env`
   - Check console for detailed logs
   - Inspect localStorage for data

4. **Testing:**
   - Test standalone mode first
   - Then test with backend
   - Verify automatic fallback

## 📚 Related Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup
- [README.md](./README.md) - Full documentation
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Backend database config

## 🎉 Summary

You can now:
- ✅ Run frontend independently
- ✅ Demo without backend
- ✅ Develop UI without database setup
- ✅ Automatic backend detection
- ✅ Graceful fallback to localStorage
- ✅ Zero configuration needed

**Just run `npm run dev` and start commenting!** 🚀
