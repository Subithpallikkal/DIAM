# DIAM — Digital Internal Audit Management

DIAM is a full-stack web application for managing internal audit workflows: clients, engagements, documents, risks, tasks, issues, and reports — with role-based access control for admins, managers, and auditors.

---

## Live deployment

| Service | URL |
|--------|-----|
| **Frontend** | [https://diam-roan.vercel.app/](https://diam-roan.vercel.app/) |
| **Backend API** | [https://diam-api.onrender.com](https://diam-api.onrender.com) |
| **API docs (Swagger)** | [https://diam-api.onrender.com/docs](https://diam-api.onrender.com/docs) |

> **Note:** The backend is hosted on Render’s free tier and may take ~30 seconds to wake up on the first request after idle time.

---

## Features

- **Dashboard** — KPI overview (clients, engagements, risks, tasks, issues) and team workload
- **Clients** — Client directory and profile management
- **Engagements** — Audit engagement lifecycle, scopes, and required document checklists
- **Documents** — Upload, categorize, and track audit documents
- **Risks** — Risk register with checklist assignments
- **Tasks** — Task tracking with assignments and comments
- **Issues** — Issue management with status history
- **Reports** — Audit reporting and exports (PDF / Excel)
- **Users & permissions** — User management and configurable role permissions (Admin / Manager / Auditor)

---

## Tech stack

### Frontend

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite 8](https://vite.dev/) | Dev server and build tool |
| [Ant Design 6](https://ant.design/) | Component library and icons |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client |
| [Day.js](https://day.js.org/) | Date formatting |
| [ESLint](https://eslint.org/) | Linting |

**Hosting:** [Vercel](https://vercel.com/)

### Backend

| Tool | Purpose |
|------|---------|
| [NestJS 11](https://nestjs.com/) | Node.js API framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Prisma 7](https://www.prisma.io/) | ORM and database migrations |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Passport JWT](https://www.passportjs.org/) | JWT authentication |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing |
| [class-validator](https://github.com/typestack/class-validator) | Request validation |
| [Swagger / OpenAPI](https://swagger.io/) | Interactive API documentation |
| [Multer](https://github.com/expressjs/multer) | File uploads |
| [PDFKit](https://pdfkit.org/) | PDF report generation |
| [ExcelJS](https://github.com/exceljs/exceljs) | Excel export |

**Hosting:** [Render](https://render.com/) (web service + managed PostgreSQL)

---

## Project structure

```
DIAM/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── api/       # API client modules
│   │   ├── components/
│   │   ├── context/   # Auth context
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── routes/
│   └── .env.example
├── backend/           # NestJS REST API
│   ├── prisma/        # Schema, migrations, seed
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── modules/
│       └── common/    # Guards, filters, interceptors
└── render.yaml        # Render deployment blueprint
```

---

## Getting started (local development)

### Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** database (local or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/DIAM.git
cd DIAM
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/diam
JWT_SECRET=your-local-jwt-secret
JWT_EXPIRES_IN=1d
PORT=3006
UPLOAD_DIR=./uploads
```

Run migrations, seed demo data, and start the API:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run start:dev
```

The API runs at `http://localhost:3006`. Swagger UI is at `http://localhost:3006/docs`.

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`. Vite proxies `/api` requests to the backend (`VITE_BACKEND_URL` in `.env`).

---

## Demo credentials

After running the database seed, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin@123 |
| Manager | manager@gmail.com | Manager@123 |
| Auditor | auditor@gmail.com | Auditor@123 |

---

## API documentation

All REST endpoints are documented with Swagger. Use **Authorize** in Swagger UI with a JWT from `POST /auth/login`.

- **Production:** [https://diam-api.onrender.com/docs](https://diam-api.onrender.com/docs)
- **Local:** `http://localhost:3006/docs`

Main API areas: Auth, Users, Roles, Clients, Engagements, Documents, Risks, Tasks, Issues, Reports.

---

## Environment variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base path (`/api` for local proxy, or full backend URL in production) |
| `VITE_BACKEND_URL` | Nest backend URL for Vite dev proxy (default `http://localhost:3006`) |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1d`) |
| `PORT` | Server port (default `3000`; use `3006` locally to match frontend proxy) |
| `UPLOAD_DIR` | Directory for uploaded documents (default `./uploads`) |

---

## Scripts

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run start:dev     # Build and watch
npm run start:prod    # Run compiled app
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:seed       # Seed roles, users, categories
npm run render:build  # Render deploy build (migrate + compile)
```

---

## Roles

| Role | Access |
|------|--------|
| **Admin** | Full access, including users and role permissions |
| **Manager** | Manage clients, engagements, and team workflows |
| **Auditor** | Execute audit work — documents, risks, tasks, issues |

---

## License

This project is provided as-is for demonstration and portfolio purposes. Add your preferred license here if you plan to open-source it.
