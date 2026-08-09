# Retrievo - Lost & Found Web Application

Retrievo is a modern full-stack web application designed to help communities connect to report, search for, and claim lost or found items. 

This repository is structured as a monorepo containing both the backend and frontend code.

---

## 📁 Repository Structure

```text
retrievo/
 ├── backend/      # Spring Boot REST API
 └── frontend/     # Web Frontend (Coming Soon)
```

---

## 🛠️ Backend Tech Stack

- **Language:** Java 25
- **Framework:** Spring Boot 4.x (with Spring Web & DevTools)
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security (Stateless JWT Authentication, BCrypt Hashing)
- **Boilerplate Reduction:** Lombok

---

## 🚀 Features Implemented (Backend)

- **Database Entity Mapping:** Mapped `User` and `Item` tables with one-to-many relationships and auto-updating audit timestamps (`createdAt`, `updatedAt`).
- **Secure Registration:** Registers new users with encrypted passwords using BCrypt, protected by email format and field validation constraints.
- **Stateless JWT Login:** Validates credentials and returns a secure JSON Web Token (JWT) for authentication.

---

## 🗺️ API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive a JWT token |

---

## ⚙️ How to Run the Backend Locally

### 1. Prerequisites
- Java 25 installed.
- PostgreSQL database running (configured with database named `retrievo_db`).

### 2. Configure Environment Properties
Create or edit the backend properties file at `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/retrievo_db
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

jwt.secret=your_cryptographically_secure_256bit_key
jwt.expiration=86400000
```

### 3. Run the Application
Import the project into IntelliJ IDEA and click **Run**, or run the following command in the `backend` directory:
```bash
./mvnw spring-boot:run
```
