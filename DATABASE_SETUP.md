# Database Switch Guide: H2 to PostgreSQL

## Current Setup: H2 (In-Memory Database)

The project is currently configured to use **H2 in-memory database** for easy demo and development. No database installation or setup is required!

### Benefits of H2 for Demo:
- ✅ No installation required
- ✅ No configuration needed
- ✅ Instant startup
- ✅ Built-in web console
- ✅ Perfect for demos and testing

### Accessing H2 Console:
1. Start the backend: `mvn spring-boot:run`
2. Open browser: `http://localhost:8080/h2-console`
3. Login with:
   - JDBC URL: `jdbc:h2:mem:ui_comment_db`
   - Username: `sa`
   - Password: (leave empty)

---

## Switching to PostgreSQL (Production)

When you're ready to deploy to production or need persistent data, switch to PostgreSQL:

### Step 1: Install PostgreSQL

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

### Step 2: Create Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE ui_comment_db;

# Create user (optional)
CREATE USER uicomment WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ui_comment_db TO uicomment;

# Exit
\q
```

### Step 3: Configure Environment

Create or update `backend/.env`:

```env
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ui_comment_db
```

### Step 4: Run with Production Profile

The project already includes `application-prod.properties` configured for PostgreSQL.

**Option A: Using Maven**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

**Option B: Using JAR**
```bash
cd backend
mvn clean package
java -jar target/ui-comment-backend-1.0.0.jar --spring.profiles.active=prod
```

**Option C: Set Environment Variable**
```bash
export SPRING_PROFILES_ACTIVE=prod
mvn spring-boot:run
```

### Step 5: Verify Connection

Check application logs for:
```
HikkaviCP - Start completed.
Hibernate: create table comments ...
```

---

## Configuration Comparison

### H2 (Default - Demo/Dev)
```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:ui_comment_db
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create-drop
```

### PostgreSQL (Production)
```properties
# application-prod.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ui_comment_db
spring.datasource.username=postgres
spring.datasource.password=password
spring.h2.console.enabled=false
spring.jpa.hibernate.ddl-auto=update
```

---

## Docker Deployment

The `docker-compose.yml` is configured for PostgreSQL production deployment:

```bash
# Start all services including PostgreSQL
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Data Migration

### From H2 to PostgreSQL

Since H2 is in-memory, data doesn't need migration for new deployments. However, if you have persistent H2 data:

1. **Export from H2:**
```sql
-- In H2 Console
SCRIPT TO 'backup.sql';
```

2. **Import to PostgreSQL:**
```bash
# Edit backup.sql to fix syntax differences
# Then import
psql -U postgres -d ui_comment_db -f backup.sql
```

---

## Profile-Based Configuration Summary

| Profile | Database | Use Case | DDL Mode | Console |
|---------|----------|----------|----------|---------|
| **default** | H2 in-memory | Demo/Dev | create-drop | Enabled |
| **dev** | H2 in-memory | Development | create-drop | Enabled |
| **prod** | PostgreSQL | Production | update | Disabled |
| **test** | H2 in-memory | Testing | create-drop | Disabled |

---

## Quick Reference

### Using H2 (Current)
```bash
# Just run - no setup needed!
mvn spring-boot:run
```

### Switching to PostgreSQL
```bash
# One-time: Create PostgreSQL database
createdb ui_comment_db

# Run with prod profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Switching Back to H2
```bash
# Just run without profile (or use dev profile)
mvn spring-boot:run
```

---

## Troubleshooting

### H2 Issues

**Problem:** Can't access H2 console
- Check: `http://localhost:8080/h2-console`
- Verify `spring.h2.console.enabled=true` in application.properties

**Problem:** Data disappears on restart
- Expected behavior - H2 is in-memory
- Use PostgreSQL for persistent data

### PostgreSQL Issues

**Problem:** Connection refused
```bash
# Check if PostgreSQL is running
brew services list  # macOS
systemctl status postgresql  # Linux

# Start PostgreSQL
brew services start postgresql@16  # macOS
sudo systemctl start postgresql  # Linux
```

**Problem:** Authentication failed
- Check username/password in `.env`
- Verify PostgreSQL user exists: `psql -U postgres -l`

**Problem:** Database doesn't exist
```bash
createdb ui_comment_db
# or
psql -U postgres -c "CREATE DATABASE ui_comment_db;"
```

---

## Best Practices

### For Demo/Development
- ✅ Use H2 (default configuration)
- ✅ No setup required
- ✅ Fast iteration
- ✅ Data resets on restart (clean state)

### For Production
- ✅ Use PostgreSQL with `prod` profile
- ✅ Set `spring.jpa.hibernate.ddl-auto=validate` after initial setup
- ✅ Use environment variables for credentials
- ✅ Enable SSL for database connections
- ✅ Regular backups
- ✅ Monitor connection pools

---

## FAQ

**Q: Will my data persist with H2?**
A: No, H2 is configured as in-memory. Data is lost on restart. Use PostgreSQL for persistence.

**Q: Can I use H2 with file persistence?**
A: Yes, change URL to `jdbc:h2:file:./data/ui_comment_db` in application.properties

**Q: Do I need to change any code to switch databases?**
A: No! Just use the appropriate profile. Spring Boot and JPA handle the differences.

**Q: Can I use MySQL instead of PostgreSQL?**
A: Yes! Add MySQL driver to pom.xml and create application-mysql.properties

**Q: How do I know which database I'm using?**
A: Check the startup logs - they show the JDBC URL and dialect being used.

---

## Additional Resources

- [H2 Database Documentation](http://www.h2database.com/)
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Spring Boot Profiles](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
