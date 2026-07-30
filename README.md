# Project Tracker

Technical Test Submission for Fullstack Developer Position at Aptavis.

## Overview

Project Tracker is a web application for managing projects and tasks.

This application supports:

- CRUD Project
- CRUD Task
- Task Hierarchy (Subtask)
- Task Dependency
- Project Dependency
- Progress Calculation
- Schedule Validation
- Recursive Task Filtering
- Circular Dependency Validation

---

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- Swagger / Postman

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- shadcn/ui

---

## Project Structure

```
project-tracker
│
├── backend
│
├── frontend
│
├── test-case-aptavis.postman_collection.json
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DaffaAudyaPramana/project-tracker.git
```

---

### Backend

```bash
cd backend

npm install
```

Create `.env`

```env
DATABASE_URL="postgresql://username:password@localhost:5432/project_tracker"
PORT=3000
```

Run migration

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Backend

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## API Documentation

API Collection is available inside:

```
test-case-aptavis.postman_collection.json
```

Import the collection into Postman to test all endpoints.

---

## Features

### Project

- Create Project
- Update Project
- Delete Project
- Schedule Validation
- Progress Calculation

### Task

- CRUD Task
- Parent / Child Task
- Recursive Filtering
- Dependency Validation

### Dependency

- Project Dependency
- Task Dependency
- Circular Dependency Detection

---

## Database

Database built using Prisma ORM with PostgreSQL.

Main entities:

- Project
- Task
- ProjectDependency
- TaskDependency

---

## Author

**Daffa Audya Pramana**

Technical Test Submission — Aptavis
