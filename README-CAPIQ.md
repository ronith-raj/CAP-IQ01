# CapIQ full-stack project

This bundle contains the React/Vite frontend and Spring Boot/MySQL backend.

## 1. Prerequisites
- Java 25 (matching `pom.xml`)
- MySQL Server and MySQL Workbench (or another MySQL client)
- Node.js with npm

## 2. Configure MySQL
1. Start MySQL.
2. Create the database once:
   ```sql
   CREATE DATABASE capiq_db;
   ```
3. Set the environment variable `CAPIQ_DB_PASSWORD` to the password for your MySQL `root` account. Do not put credentials into source control.
4. The backend uses `spring.jpa.hibernate.ddl-auto=update` to create/update tables from entities.

## 3. Start backend (PowerShell)
Open PowerShell in `capiq-backend` and run:

```powershell
$env:CAPIQ_DB_PASSWORD = Read-Host "Enter your MySQL root password"
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:CAPIQ_JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
.\mvnw.cmd spring-boot:run
```

Keep this terminal open. The generated JWT secret is temporary for this local run; users may need to log in again after restarting the backend. For a stable local secret, set `CAPIQ_JWT_SECRET` to a private Base64-encoded 32-byte secret in your own environment. Never share it.

Health check: `http://localhost:8080/api/health`

## 4. Start frontend
Open a second PowerShell in `capiq-frontend` and run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. The Vite development server proxies `/api` calls to `http://localhost:8080`.

## 5. API routes in this project
- `POST /api/users` — register
- `POST /api/auth/login` — login and receive JWT
- `GET /api/health` — health check
- `GET /api/academic-profile`, `POST /api/academic-profile`
- `GET /api/skills`, `POST /api/skills`, `DELETE /api/skills/{id}`
- `GET /api/achievements`, `POST /api/achievements`, `DELETE /api/achievements/{id}`
- `GET /api/resume`, `POST /api/resume`
- `POST /api/resume/ats-analysis`
- `GET /api/courses` — course catalogue

Most API routes require `Authorization: Bearer <JWT>`. Login and registration are public. Resume/academic profile and skill/achievement data use the authenticated account. Course catalogue data is seeded in code; course progress and saved selections are stored in this browser's local storage in this version.

## Important notes
- The app requires the backend and MySQL to be running for account and database features.
- The frontend can fall back to the built-in course catalogue if the course API is unavailable.
- This bundle has not been run against your local MySQL instance, so confirm the health endpoint and login after setting your own database password.
- Rotate any database password or token that was previously pasted into a chat or otherwise shared.
