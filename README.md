# 📚 ShareShelf

A community book-sharing web app. Members put books on their shelf, others browse and request to borrow, and the owner approves, rejects or marks the book as returned.

Full stack project: **React + Bootstrap** frontend, **Spring Boot + Hibernate** REST API, **MySQL** database, **JWT** authentication.

## Screenshots
> Add your own images to a `docs/` folder and update the links below.

| Browse | My Shelf | Dashboard |
|---|---|---|
| ![Browse](docs/browse.png) | ![My Shelf](docs/my-shelf.png) | ![Dashboard](docs/dashboard.png) |

## Features
- Register / login with JWT, passwords hashed with BCrypt
- Add, **edit** and remove books (cover image link, genre, condition)
- Search and filter books by title, author, genre and availability
- Borrow workflow: request -> approve / reject -> mark returned (owner), cancel (borrower)
- Dashboard, wishlist, dark mode
- Game layer: XP, levels, daily quests, streaks, achievements and collectible rarity cards (derived from real activity)
- **Admin panel**: platform stats, manage users and books (role-based access, `ADMIN` only)

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Bootstrap 5, Context API |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA / Hibernate |
| Database | MySQL 8 |
| Auth | JWT (stateless), BCrypt |
| Tooling | Maven, npm, Git, Docker |

## Architecture
```
React (5173)  --REST/JSON + JWT-->  Spring Boot (8080)  --Hibernate-->  MySQL (3306)
```
Backend layers: `controller` -> `service` -> `repository` -> `entity`, with DTOs, validation and a global exception handler.

## API overview
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/books`, `/api/books/{id}` | public |
| GET | `/api/books/my` | user |
| POST / PUT / DELETE | `/api/books`, `/api/books/{id}` | owner (admin can delete) |
| POST | `/api/requests` | user |
| GET | `/api/requests/sent`, `/api/requests/received` | user |
| PUT | `/api/requests/{id}/approve \| reject \| return \| cancel` | owner / borrower |
| GET / DELETE | `/api/admin/users`, `/api/admin/users/{id}` | admin |

## Run locally
**Requirements:** Java 17, Maven, Node 18+, MySQL 8.

1. **Database password (kept out of Git):** create `shareshelf-backend/src/main/resources/application-local.properties`
   ```
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
2. **Backend**
   ```
   cd shareshelf-backend
   mvn spring-boot:run "-Dspring-boot.run.profiles=local"
   ```
   Tables are created automatically. A default admin is created on first start: `admin@shareshelf.com` / `Admin@123` (change it before deploying).
3. **Frontend**
   ```
   cd shareshelf-frontend
   npm install
   npm run dev -- --port 5173
   ```
   Open http://localhost:5173

## Deployment
See [DEPLOY.md](DEPLOY.md) (Aiven MySQL + Render backend + Vercel frontend).
Config is read from environment variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`, `CORS_ORIGINS`.

## Roadmap
Ratings and reviews, pagination, email notifications, image upload, unit and integration tests.

## Author
Ashwini Devikar - MCA graduate, Full Stack Developer (React, Spring Boot, PHP, MySQL) - Nagpur, India.
