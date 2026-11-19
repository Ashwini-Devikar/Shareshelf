# ShareShelf Backend

Spring Boot 3 + Hibernate + MySQL + JWT REST API for ShareShelf.

## Requirements
- Java 17+
- Maven 3.9+ (`mvn -version` must work)
- MySQL 8 running on port 3306

## Setup
1. Open `src/main/resources/application.properties`
2. Set `spring.datasource.password` to your MySQL root password
3. Run (from this folder):

```powershell
mvn spring-boot:run
```

The database `shareshelf` and its tables are created automatically.
API runs at http://localhost:8080

A default admin is created on first start: `admin@shareshelf.com` / `Admin@123` (change it in application.properties).

## Endpoints (Week 2)

| Method | URL | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/books?q=&genre=&available= | Public |
| GET | /api/books/{id} | Public |
| GET | /api/books/my | Logged in |
| POST | /api/books | Logged in |
| PUT | /api/books/{id} | Owner |
| DELETE | /api/books/{id} | Owner or Admin |
| GET | /api/admin/users | Admin |
| DELETE | /api/admin/users/{id} | Admin |

Send the token on protected calls: `Authorization: Bearer <token>`

## Quick test (PowerShell)

```powershell
# Register
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/register -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"123456","city":"Nagpur"}'

# Login and keep the token
$r = Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/login -ContentType "application/json" -Body '{"email":"test@example.com","password":"123456"}'
$token = $r.token

# Add a book
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/books -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"title":"Clean Code","author":"Robert C. Martin","genre":"Technology","condition":"GOOD"}'

# List books (public)
Invoke-RestMethod -Uri http://localhost:8080/api/books
```

## Structure
```
src/main/java/com/shareshelf/
├── config/       SecurityConfig, DataInitializer
├── controller/   AuthController, BookController, AdminController
├── dto/          request and response records
├── entity/       User, Book + enums
├── exception/    ApiException, GlobalExceptionHandler
├── repository/   UserRepository, BookRepository
├── security/     JwtUtil, JwtFilter
└── service/      AuthService, BookService
```

## Next (Week 3)
BorrowRequest entity and the approve / reject / return workflow, then connect the React frontend.
