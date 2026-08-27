# 🔍 Retrievo — AI-Powered Campus Lost & Found Community

<p align="center">
  <strong>A modern, production-grade campus lost and found platform featuring semantic vector search with Google Gemini & PostgreSQL <code>pgvector</code> to match misplaced belongings in real time.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3" />
  <img src="https://img.shields.io/badge/Spring_AI-1.0.0--M6-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring AI" />
  <img src="https://img.shields.io/badge/Google_Gemini-Embeddings-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL pgvector" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JWT-Stateless_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## 🏛️ System Architecture

Retrievo combines high-performance relational state management with a **1536-Dimensional Approximate Nearest Neighbor (ANN) Vector Search Engine**:

```
┌─────────────────────────┐          JSON / REST          ┌──────────────────────────────────────────────┐
│     React Frontend      │ <───────────────────────────> │             Spring Boot 3 Backend            │
│  (Vite + Glassmorphism) │   (JWT Bearer Interceptors)   │ ┌──────────────────────────────────────────┐ │
└─────────────────────────┘                               │ │ Spring Security 6 (Stateless JWT Filter) │ │
                                                          │ ├──────────────────────────────────────────┤ │
                                                          │ │ Spring Data JPA (Relational CRUD)        │ │
                                                          │ ├──────────────────────────────────────────┤ │
                                                          │ │ Spring AI + Gemini Embeddings (1536-D)   │ │
                                                          │ └─────────────────────┬────────────────────┘ │
                                                          └───────────────────────┼──────────────────────┘
                                                                                  │
                                                ┌─────────────────────────────────┴──────────────────────────────┐
                                                ▼                                                                ▼
                                  ┌───────────────────────────┐                    ┌───────────────────────────┐
                                  │   Relational PostgreSQL   │                    │    Neon `pgvector` HNSW   │
                                  │  (Users, Items, Claims)   │                    │ (1536-D Cosine Similarity)│
                                  └───────────────────────────┘                    └───────────────────────────┘
```

---

## ✨ SmartMatch AI Vector Engine

Standard keyword search fails when students use different terms (e.g. searching *"dark blue metal thermos in reading room"* when an item was posted as *"Navy Blue Hydro Flask in Library 2nd Floor"*). 

Retrievo resolves this through **Dense Vector Embeddings & Cosine Distance Search**:

1. **Google Gemini Embeddings:** When items are reported or searched, natural language descriptions are transformed into 1,536-dimensional semantic vectors using `gemini-embedding-001`.
2. **PostgreSQL `pgvector` HNSW Index:** Stored in Neon PostgreSQL with a Hierarchical Navigable Small World (HNSW) index for sub-50ms Approximate Nearest Neighbor (ANN) search.
3. **Opposite-Type Semantic Matching:** Querying for lost items automatically filters and ranks found items (`LOST` $\leftrightarrow$ `FOUND`) with similarity confidence scores (e.g. **85% Match**).

```text
Student Query: "Lost my dark blue metal thermos near the 2nd floor study area"
Embedding:     [0.0142, -0.0521, 0.0891, ..., 0.0034]  (1536 Dimensions)
                      │
                      ▼ Cosine Distance Vector Search (HNSW Index)
Database Result:  #8 "Navy Blue Hydro Flask 32oz" (Score: 0.85 — 85% High Match)
```

---

## 🚀 Key Engineering Highlights

### 🛡️ Backend Engineering (Spring Boot 3 + Java 21)
* **Stateless JWT Security & Custom Claims:** Zero-session Spring Security 6 filter chain with BCrypt password hashing, role-based authorization, and custom user claims (`fullName`, `role`).
* **Deterministic UUID Document Mapping:** Generated Type-3 UUIDs from relational entity IDs (`UUID.nameUUIDFromBytes`) to prevent vector store document collisions and duplicates.
* **Claims State Machine & Invariant Enforcement:**
  * **Self-Claim Guard:** Prevents finders from claiming their own reported items.
  * **Anti-Spam Guard:** Prevents duplicate `PENDING` claims by the same claimant on the same item.
  * **Atomic Status Transitions:** Approving a claim automatically updates the claim to `APPROVED`, changes the item status from `OPEN` to `CLAIMED`, and auto-rejects competing pending claims within a single database transaction.
* **JPA Criteria Dynamic Filtering:** Substring, location, and category filtering without combinatorial query explosion.

### 🎨 Frontend Engineering (React 19 + Vite)
* **Modern Obsidian Glass Aesthetics:** Deep space dark mode (`#070b14`), glassmorphism card panels (`backdrop-filter: blur`), custom neon status pills, and typography (`Outfit` & `Plus Jakarta Sans`).
* **Context-Driven State Architecture:** Single-source-of-truth `AuthContext` and `AiModalContext` for zero modal duplication and seamless authentication state across routes.
* **Interactive Dashboard Hub:** Direct card-level navigation, profile editor modal, and personal claim management.

---

## 🗺️ REST API Reference

### 1. Authentication & Profile (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new campus user |
| `POST` | `/api/auth/login` | Public | Authenticate user, returns JWT and user profile |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update full name and contact phone number |

### 2. Item Management & AI Search (`/api/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Public | Paginated multi-criteria item search & filter |
| `GET` | `/api/items/{id}` | Public | Get full item details by ID |
| `GET` | `/api/items/match` | Public | **✨ SmartMatch AI:** Semantic vector similarity search via `pgvector` |
| `POST` | `/api/items` | Authenticated | Report a new lost or found item (Auto-indexes vector) |
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

## 💻 Local Development Setup

### Prerequisites
* **Java 21 LTS** or higher
* **Node.js 18+** & `npm`
* **PostgreSQL Database** (e.g. Neon Serverless with `pgvector` extension enabled)
* **Google Gemini API Key**

### 1. Backend Configuration
Configure `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://<neon-host>/retrievo_db?sslmode=require
spring.datasource.username=<username>
spring.datasource.password=<password>

# Spring AI & Google Gemini Vector Configuration
spring.ai.vectorstore.pgvector.dimensions=1536
spring.ai.vectorstore.pgvector.distance-type=COSINE_DISTANCE
spring.ai.vectorstore.pgvector.index-type=HNSW
spring.ai.openai.api-key=${GEMINI_API_KEY}
spring.ai.openai.base-url=https://generativelanguage.googleapis.com/v1beta/openai/
spring.ai.openai.embedding.options.model=gemini-embedding-001
spring.ai.openai.embedding.options.dimensions=1536
```

Run the backend:
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
