# Deploying ShareShelf (free tier)

Order matters: database, then backend, then frontend, then connect them.

## 1. Database (MySQL)
Create a free MySQL database on **Aiven** (or Railway). Note the host, port, database name, username and password.
Your JDBC URL will look like:
`jdbc:mysql://HOST:PORT/DBNAME?useSSL=true&serverTimezone=UTC`

## 2. Backend (Spring Boot) on Render
1. Push the project to GitHub.
2. Render -> New -> **Web Service** -> pick the repo, set **Root Directory** to `shareshelf-backend`, **Runtime** to Docker (the Dockerfile is included).
3. Add these environment variables:

| Name | Value |
|------|-------|
| `DB_URL` | the JDBC URL from step 1 |
| `DB_USERNAME` | database user |
| `DB_PASSWORD` | database password |
| `JWT_SECRET` | any random string, 32+ characters |
| `ADMIN_PASSWORD` | a new strong admin password (do NOT keep `Admin@123`) |
| `CORS_ORIGINS` | your frontend URL (fill in after step 3), e.g. `https://shareshelf.vercel.app` |

4. Deploy. Test `https://YOUR-BACKEND.onrender.com/api/books` in the browser: you should see `[]`.
   (Free Render services sleep when idle, so the first request can take about a minute.)

## 3. Frontend (React) on Vercel
1. Vercel -> New Project -> pick the repo, set **Root Directory** to `shareshelf-frontend`. Framework: Vite.
2. Add the environment variable `VITE_API_URL` = your Render backend URL (no trailing slash).
3. Deploy, then copy the Vercel URL.

## 4. Connect them
Go back to Render, set `CORS_ORIGINS` to the Vercel URL, and redeploy the backend.
Open the Vercel site, register, and add a book.

## Checklist before sharing the link
- [ ] `ADMIN_PASSWORD` and `JWT_SECRET` changed
- [ ] Your real MySQL password is NOT in any committed file
- [ ] Live link and GitHub link added to your resume
