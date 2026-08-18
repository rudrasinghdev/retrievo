# 🔍 Retrievo — Campus Lost & Found Community

<p align="center">
  <img src="https://raw.githubusercontent.com/rudrasinghdev/retrievo/main/frontend/public/favicon.svg" width="80" height="80" alt="Retrievo Logo" />
</p>

<p align="center">
  <strong>A modern, production-grade campus lost and found web application designed to connect communities to report, search for, and claim misplaced belongings securely.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-25_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 25" />
  <img src="https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JWT-Stateless_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

<p align="center">
  <a href="https://retrievo-app.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Deployment-retrievo--app.vercel.app-00DC82?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Deployment" />
  </a>
</p>

---

## 🏛️ System Architecture

Retrievo is structured as a full-stack monorepo featuring a decoupled, high-performance Spring Boot REST API backend and a responsive, glassmorphic React Single Page Application (SPA).

```text
retrievo/
 ├── backend/      # Spring Boot 4 REST API, JPA Criteria Search, Claims State Machine
 └── frontend/     # React 19 + Vite SPA, Glassmorphism UI, Axios JWT Interceptors
```

```
┌─────────────────────────┐          JSON / REST          ┌─────────────────────────┐
│     React Frontend      │ <───────────────────────────> │   Spring Boot Backend   │
│  (Vite + Glassmorphism) │   (JWT Bearer Interceptors)   │  (Stateless Security)   │
└─────────────────────────┘                               └────────────┬────────────┘
                                                                       │ Spring Data JPA
                                                                       ▼
                                                          ┌─────────────────────────┐
                                                          │   PostgreSQL Database   │
                                                          │ (Indexed Relational DB) │
                                                          └─────────────────────────┘
```

---

## 🚀 Key Engineering Highlights

### 🛡️ Backend Engineering
* **Stateless JWT Security & Password Hashing:** Zero-session Spring Security filter chain with BCrypt password hashing and custom `UserDetails`.
* **Dynamic Search Engine (JPA Criteria API):** Extends `JpaSpecificationExecutor` for dynamic, multi-attribute filtering (category, type, status, and case-insensitive substring search across title and description) without combinatorial query explosion.
* **Claims State Machine & Invariant Enforcement:**
  * **Self-Claim Guard:** Prevents posters from claiming their own items.
  * **Anti-Spam Guard:** Blocks duplicate `PENDING` claims by the same claimant on the same item.
  * **Atomic Status Transitions:** Approving a claim automatically updates the claim to `APPROVED`, changes the item status from `OPEN` to `CLAIMED`, and auto-rejects competing pending claims within a single database transaction.
* **N+1 Query Prevention:** Utilizes `@EntityGraph(attributePaths = {"item", "claimant"})` for single-query left outer join fetches.
* **Centralized Global Exception Handling:** Uniform JSON error serialization for `400 (Bad Request)`, `401 (Unauthorized)`, `403 (Forbidden)`, `404 (Not Found)`, and `409 (Conflict)`.

### 🎨 Frontend Engineering
* **Modern Design System:** Deep space dark mode (`#090d16`), glassmorphism card panels (`backdrop-filter: blur`), custom status badges, and Google typography (`Outfit` & `Plus Jakarta Sans`).
* **Centralized Axios Interceptor:** Automatically injects JWT tokens into outgoing request headers and intercepts `401 Unauthorized` responses to redirect to `/login`.
* **Debounced Live Search:** 300ms query debouncing to minimize backend network load during real-time typing.
* **Owner's Claim Review Management:** Dedicated interactive review panel allowing item finders to inspect submitted proofs and approve or reject claims with one click.

---

## 🗺️ REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new campus user |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |

### 2. Item Management & Search (`/api/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Public | Paginated multi-criteria item search & filter |
| `GET` | `/api/items/{id}` | Public | Get full item details by ID |
| `POST` | `/api/items` | Authenticated | Report a new lost or found item |
| `GET` | `/api/items/me` | Authenticated | Get all items posted by the current user |
| `PUT` | `/api/items/{id}` | Poster / Admin | Update item details (ownership protected) |
| `DELETE`| `/api/items/{id}` | Poster / Admin | Delete item (ownership protected) |

### 3. Claims & Verification (`/api/claims`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/items/{itemId}/claims` | Authenticated | Submit an ownership claim for an item |
| `GET` | `/api/items/{itemId}/claims` | Poster / Admin | View all claims submitted on a specific item |
| `GET` | `/api/claims/me` | Authenticated | View all claims submitted by the current user |
| `PATCH`| `/api/claims/{claimId}/status` | Poster / Admin | Approve or Reject a claim (transitions item state) |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
* **Java 25 LTS**
* **Node.js v20+** & **npm v10+**
* **PostgreSQL 16** (running locally on port `5432` with database `retrievo_db`)

---

### 2. Start the Backend API
1. Configure database credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/retrievo_db
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   
   jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B59703D
   jwt.expiration=86400000
   ```
2. Run the Spring Boot application:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *Backend server starts at `http://localhost:8080`.*

---

### 3. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend dev server launches at `http://localhost:5173`.*

---

## 🌐 Production Deployment

| Component | Platform | Configuration |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Root directory: `frontend`, Build: `npm run build`, Env: `VITE_API_URL` |
| **Backend** | **Render / Railway** | Root directory: `backend`, Build: `./mvnw clean package -DskipTests` |
| **Database** | **Neon / Supabase** | Serverless Cloud PostgreSQL with SSL pooling |

---

## 👨‍💻 Author

* **Rudra Singh** — *NIT Jalandhar (IT)*
* GitHub: [@rudrasinghdev](https://github.com/rudrasinghdev)
