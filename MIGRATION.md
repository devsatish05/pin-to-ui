# Database Migration: MySQL to PostgreSQL

## Migration Summary

This document outlines all changes made to migrate the UI Comment System from MySQL to PostgreSQL.

**Date:** December 18, 2025  
**Migration Type:** MySQL 8.0 → PostgreSQL 16

---

## 🔄 Files Modified

### Backend Configuration

#### 1. `backend/pom.xml`
**Changed:**
- ✅ Removed MySQL driver dependency (`mysql-connector-j`)
- ✅ Added PostgreSQL driver dependency (`postgresql`)

```xml
<!-- OLD -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- NEW -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### 2. `backend/src/main/resources/application.properties`
**Changed:**
- ✅ Database URL: `jdbc:mysql://localhost:3306/ui_comment_db` → `jdbc:postgresql://localhost:5432/ui_comment_db`
- ✅ Driver class: `com.mysql.cj.jdbc.Driver` → `org.postgresql.Driver`
- ✅ Hibernate dialect: `MySQLDialect` → `PostgreSQLDialect`
- ✅ Default username: `root` → `postgres`
- ✅ Added LOB creation property for PostgreSQL

#### 3. `backend/.env.example`
**Changed:**
- ✅ Default username: `root` → `postgres`
- ✅ Default port: `3306` → `5432`

### Docker Configuration

#### 4. `docker-compose.yml`
**Changed:**
- ✅ Service name: `mysql` → `postgres`
- ✅ Container name: `ui-comment-mysql` → `ui-comment-postgres`
- ✅ Image: `mysql:8.0` → `postgres:16-alpine`
- ✅ Environment variables adapted for PostgreSQL
- ✅ Port mapping: `3306:3306` → `5432:5432`
- ✅ Volume: `mysql_data` → `postgres_data`
- ✅ Health check: `mysqladmin ping` → `pg_isready`
- ✅ Backend datasource URL updated

#### 5. `.env.docker.example`
**Changed:**
- ✅ Default username: `uicomment` → `postgres`

### Documentation

#### 6. `README.md`
**Changed:**
- ✅ Prerequisites: MySQL 8.0+ → PostgreSQL 12+
- ✅ Features: MySQL Database → PostgreSQL Database
- ✅ Database setup commands updated
- ✅ Connection string examples updated

#### 7. `INSTRUCTIONS.md`
**Changed:**
- ✅ Installation section: MySQL → PostgreSQL installation instructions
- ✅ Database configuration steps updated with PostgreSQL commands
- ✅ Environment variable defaults updated
- ✅ Troubleshooting section updated with PostgreSQL-specific tips
- ✅ Port references: 3306 → 5432

#### 8. `architect.md`
**Changed:**
- ✅ Completely rewritten with comprehensive project documentation
- ✅ Added full project structure visualization
- ✅ Added database schema (PostgreSQL syntax with BIGSERIAL)
- ✅ Tech stack updated to PostgreSQL 16
- ✅ Configuration sections updated
- ✅ Added API endpoints documentation
- ✅ Added development workflow
- ✅ Added security considerations
- ✅ Added future enhancements section

---

## 🗄️ Database Schema Differences

### Primary Key Generation

**MySQL:**
```sql
id BIGINT AUTO_INCREMENT PRIMARY KEY
```

**PostgreSQL:**
```sql
id BIGSERIAL PRIMARY KEY
```

### Dialect Changes

The Hibernate dialect was changed to properly support PostgreSQL-specific features:
- `org.hibernate.dialect.MySQLDialect` → `org.hibernate.dialect.PostgreSQLDialect`

### Additional Configuration

Added PostgreSQL-specific property:
```properties
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
```

This prevents issues with PostgreSQL LOB creation.

---

## 🚀 Migration Steps for Existing Deployments

### For Development Environment

1. **Stop existing services:**
   ```bash
   # Stop backend if running
   # Stop MySQL service
   brew services stop mysql  # macOS
   sudo systemctl stop mysql  # Linux
   ```

2. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql@16
   brew services start postgresql@16
   
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

3. **Create new database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE ui_comment_db;
   \q
   ```

4. **Update configuration:**
   ```bash
   cd backend
   # Update .env file with PostgreSQL credentials
   # DB_USERNAME=postgres
   # DB_PASSWORD=your_password
   # DB_PORT=5432
   ```

5. **Rebuild and restart:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### For Docker Deployment

1. **Stop and remove old containers:**
   ```bash
   docker-compose down -v
   ```

2. **Update environment file:**
   ```bash
   cp .env.docker.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Start new services:**
   ```bash
   docker-compose up -d
   ```

4. **Verify services:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

---

## 📊 Data Migration (If Needed)

If you have existing data in MySQL that needs to be migrated:

### Option 1: Using pgloader

```bash
# Install pgloader
brew install pgloader  # macOS
sudo apt install pgloader  # Linux

# Run migration
pgloader mysql://root:password@localhost/ui_comment_db \
         postgresql://postgres:password@localhost/ui_comment_db
```

### Option 2: Manual Export/Import

```bash
# Export from MySQL
mysqldump -u root -p ui_comment_db > backup.sql

# Transform MySQL syntax to PostgreSQL (manual editing required)
# - Change AUTO_INCREMENT to SERIAL
# - Update data types if needed
# - Change backticks to double quotes

# Import to PostgreSQL
psql -U postgres -d ui_comment_db -f backup_transformed.sql
```

---

## ✅ Verification Checklist

- [x] PostgreSQL driver added to pom.xml
- [x] Database connection string updated
- [x] Hibernate dialect changed to PostgreSQL
- [x] Environment variables updated
- [x] Docker Compose configuration updated
- [x] Health checks updated for PostgreSQL
- [x] Documentation updated (README, INSTRUCTIONS, architect.md)
- [x] Port references changed (3306 → 5432)
- [x] Default username changed (root → postgres)

---

## 🔍 Testing

After migration, verify:

1. **Backend starts successfully:**
   ```bash
   mvn spring-boot:run
   # Check logs for successful database connection
   ```

2. **Database tables are created:**
   ```bash
   psql -U postgres -d ui_comment_db
   \dt
   # Should show "comments" table
   ```

3. **API endpoints work:**
   ```bash
   # Create a comment
   curl -X POST http://localhost:8080/api/comments \
     -H "Content-Type: application/json" \
     -d '{"pageUrl":"test","content":"test","positionX":100,"positionY":100}'
   
   # Get all comments
   curl http://localhost:8080/api/comments
   ```

4. **Frontend can connect:**
   - Start frontend: `npm run dev`
   - Open http://localhost:5173
   - Test creating and viewing comments

---

## 📝 Notes

- PostgreSQL is generally more standards-compliant than MySQL
- PostgreSQL offers better support for complex queries and JSON data
- PostgreSQL has stricter type checking
- Performance characteristics may differ for certain queries
- PostgreSQL is ACID-compliant by default

---

## 🆘 Rollback Plan

If you need to rollback to MySQL:

1. Checkout previous git commit before migration
2. Restore MySQL database from backup
3. Restart services

Or manually revert changes in:
- `backend/pom.xml` (restore MySQL driver)
- `backend/src/main/resources/application.properties`
- `docker-compose.yml`
- Environment files

---

## 📚 Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [Spring Data JPA with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)
- [Hibernate PostgreSQL Dialect](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/dialect/PostgreSQLDialect.html)
- [pgloader Migration Tool](https://pgloader.io/)

---

**Migration Status:** ✅ Complete  
**Breaking Changes:** None (fresh database will be created)  
**Backward Compatible:** No (requires PostgreSQL)
