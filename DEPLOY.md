# 🚀 Render.com Deployment Guide — Spring Java Mastery

## Step-by-Step: Deploy using Google Login

---

## STEP 1 — Sign Up on Render with Google

1. Open browser → go to **https://render.com**
2. Click **"Get Started for Free"**
3. Click **"Continue with Google"**
4. Login with: **mdsadiqueamin721786@gmail.com**
5. Complete Google authentication
6. You'll land on the Render Dashboard: **https://dashboard.render.com**

---

## STEP 2 — Connect GitHub Account

1. On the Render Dashboard, click **"New +"** (top right)
2. Select **"Blueprint"**
3. Click **"Connect GitHub"**
4. Authorize Render to access your GitHub account
5. Search for repository: **`java-spring-and-spring-boot-and-sql`**
6. Select it (owned by Sadique721)

---

## STEP 3 — Deploy the Blueprint

1. Render will **auto-detect** the `render.yaml` file in the repository root
2. It will show you **2 services** to be created:
   - 🗄️ **springmastery-db** (Free PostgreSQL database)
   - 🌐 **spring-java-mastery** (Docker Web Service)
3. Click **"Apply"** to start deployment

---

## STEP 4 — Monitor Deployment

1. Go to the **Web Service** → click **"Logs"** tab
2. Watch for:
   ```
   [Render] Converted DB URL to JDBC format...
   Flyway: Successfully validated migrations
   TopicDataSeeder: Database content is already seeded
   Tomcat started on port 10000
   ```
3. ⚠️ **First deploy takes 10-15 minutes** (Docker build + DB seeding)
4. Health check URL: `/actuator/health`

---

## STEP 5 — Access Your App

Once deployed, Render gives you a URL like:
```
https://spring-java-mastery.onrender.com
```

- 🏠 **Dashboard:** `https://spring-java-mastery.onrender.com/dashboard`
- 📚 **Topics:** `https://spring-java-mastery.onrender.com/topic/what-is-spring`
- 🧠 **Graph:** `https://spring-java-mastery.onrender.com/graph`
- ❤️ **Health:** `https://spring-java-mastery.onrender.com/actuator/health`

---

## ⚠️ Important Notes — Free Tier

| Issue | Solution |
|---|---|
| **Cold starts** | Service sleeps after 15min inactivity — first request takes ~30-60s |
| **Build time** | Docker build takes ~10-12min (Maven downloads deps) |
| **Memory** | JVM set to use 70% of 512MB — sufficient for the app |
| **DB connections** | HikariCP pool = 3 (free tier limit) |
| **After 2nd deploy** | Set `APP_SEED_ENABLED=false` in Render env vars |

---

## 🔧 Environment Variables (auto-set by render.yaml)

| Variable | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `render` |
| `SPRING_DATASOURCE_URL` | Auto-injected from PostgreSQL DB |
| `SPRING_DATASOURCE_USERNAME` | Auto-injected from PostgreSQL DB |
| `SPRING_DATASOURCE_PASSWORD` | Auto-injected from PostgreSQL DB |
| `PORT` | `10000` |
| `APP_SEED_ENABLED` | `true` (set to `false` after first deploy) |

---

## 🛠️ If Build Fails

| Error | Fix |
|---|---|
| `postgres:// URL not supported` | `RenderDatabaseConfig.java` handles this automatically |
| `Out of memory / OOM` | Upgrade to Starter plan in Render settings |
| `Health check failed` | Increase grace period to 300s in Service → Settings |
| `Flyway migration failed` | Check DB is running: Service → Environment → DB status |

---

*Built by Md Sadique Amin — © 2026 ✦ AUTHORIZED*
