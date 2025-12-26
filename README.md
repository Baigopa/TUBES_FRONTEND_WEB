# TUBES Frontend + Simple Backend

This workspace contains static frontend files and a minimal Node.js backend (`server.js`) to demonstrate reading `.env` values and handling a demo login.

Quick start:

1. Copy `.env.example` to `.env` and edit values if needed.

2. Install dependencies:

```bash
npm install
```

3. Run server:

```bash
npm start
```

4. Open browser at `http://localhost:3000/login.html`.

Demo credentials (from `.env.example`):

- Email: `test@example.com`
- Password: `secret`

Notes:
- The backend reads `.env` using `dotenv`. In a real app you should connect to your database using the DB env variables and implement secure authentication.
