# borrowing system

A local development environment for tracking borrowed items.

## Stack

- React + Vite
- Express API
- Tailwind CSS v4
- PostgreSQL 16 via Docker Compose

## Getting started

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm.cmd install` on Windows.
3. Start PostgreSQL with `npm.cmd run db:up`.
4. Start the client and API with `npm.cmd run dev`.
5. Open http://localhost:5173.

The API runs at http://localhost:3001. PostgreSQL is exposed on port `55432` to avoid conflicts with a PostgreSQL service already using the default `5432` port. The database schema and one demo borrowing are initialized automatically on the first database start.
