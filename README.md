# Budget Splitter

A React + Vite frontend with a Node.js/Express API and MongoDB storage for trips, group members, and expenses.

## New feature: Equal expense split

Each trip now displays a **Split Money** section. Expenses are divided equally among the trip's current members. The section shows each member's net balance across all expenses:

- **Gets ₹...** — the member paid more than their share and should receive money.
- **Owes ₹...** — the member's share is greater than what they paid.
- **Settled** — the member's net balance is zero.

## Requirements

- Node.js and npm
- MongoDB running locally at `mongodb://localhost:27017/travelDB`

## Run the backend

Open a terminal in `backend`:

```bash
npm install
npm start
```

The API runs on `http://localhost:3000`.

## Run the frontend

Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Notes

- Start MongoDB before using the app.
- The frontend API URL is currently `http://localhost:3000` in `frontend/src/App.jsx`.
- The split is equal across all current members of a trip; it does not yet support excluding a member from a specific expense or marking settlements as paid.
