# Farm Crop Management System – Full Stack

A production-ready full-stack application for managing farm operations.
Built with **React** (frontend) + **Spring Boot 3 + Java 17** (backend) + **MySQL** (database).

---

## Project Structure

```
farm-crop-system/
├── backend/        ← Spring Boot REST API (port 8080)
├── frontend/       ← React Dashboard UI (port 3000)
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Axios, Chart.js, React Router |
| Backend  | Java 17, Spring Boot 3, Spring Security |
| ORM      | Spring Data JPA + Hibernate             |
| Database | MySQL 8                                 |
| Auth     | JWT (stateless)                         |
| DevOps   | Docker, Docker Compose, GitHub Actions  |

---

## Run Locally (without Docker)

### 1. Start MySQL
```bash
docker run -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=farm_crop_db -p 3306:3306 mysql:8.0
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
# → http://localhost:8080
# → Swagger: http://localhost:8080/swagger-ui/index.html
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## Run with Docker (all 3 services at once)

```bash
# From root of farm-crop-system/
docker-compose up --build
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| Backend  | http://localhost:8080            |
| Swagger  | http://localhost:8080/swagger-ui |

---

## Default Login Credentials

| Role  | Username | Password |
|-------|----------|----------|
| Admin | admin    | admin123 |
| User  | user     | user123  |

> Admin can create, edit and delete. User has read-only access.

---

## API Endpoints

| Method | Endpoint                        | Role       |
|--------|---------------------------------|------------|
| POST   | /api/auth/login                 | Public     |
| POST   | /api/auth/register              | Public     |
| GET    | /api/farmers                    | USER+ADMIN |
| POST   | /api/farmers                    | ADMIN      |
| PUT    | /api/farmers/{id}               | ADMIN      |
| DELETE | /api/farmers/{id}               | ADMIN      |
| GET    | /api/crops                      | USER+ADMIN |
| POST   | /api/crops                      | ADMIN      |
| GET    | /api/fields                     | USER+ADMIN |
| POST   | /api/fields                     | ADMIN      |
| GET    | /api/crop-records               | USER+ADMIN |
| POST   | /api/crop-records               | ADMIN      |

---

## CI/CD

Every push to `main` triggers GitHub Actions to:
- Build and test the Spring Boot backend (with MySQL service)
- Build the React frontend
- Run all unit tests