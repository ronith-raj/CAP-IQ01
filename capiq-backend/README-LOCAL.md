CapIQ backend local setup
==========================

Requires Java 25 and MySQL.

1. In MySQL, run: CREATE DATABASE capiq_db;
2. In PowerShell from this folder:
   $env:CAPIQ_DB_PASSWORD = Read-Host "Enter your MySQL root password"
   $bytes = New-Object byte[] 32
   $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
   $rng.GetBytes($bytes)
   $env:CAPIQ_JWT_SECRET = [Convert]::ToBase64String($bytes)
   $rng.Dispose()
   .\mvnw.cmd spring-boot:run

Keep this terminal open while using the frontend. The JWT secret generated this way is temporary and resets on each run. Use your own private stable secret if you want persistent sessions between restarts. Never share secrets.

The application reads database and JWT secrets from environment variables; no credentials are stored in application.properties.
