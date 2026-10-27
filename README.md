# Recipe Book — MERN Stack

A responsive Recipe Book application built with React, Express, Node.js, Mongoose, and MongoDB Atlas.

## Requirements
- Node.js and npm
- MongoDB Atlas database

## 1. Configure the backend
Open a terminal in `backend` and run:

```bash
npm install
```

Open `backend/.env` and replace `PASTE_YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE` with your MongoDB Atlas connection URI. Keep your password private.

Then start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Start the frontend
Open a second terminal in `frontend` and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API endpoints
- `POST /api/recipes` — create a recipe
- `GET /api/recipes` — list all recipes
- `GET /api/recipes/:id` — get recipe details
- `PUT /api/recipes/:id` — update a recipe
- `DELETE /api/recipes/:id` — delete a recipe

## GitHub and secrets
Do not commit a real database password to a public repository. Use `.env.example` as a template and configure secrets privately. The included `.env` contains a placeholder and must be updated before running.
