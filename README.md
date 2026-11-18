# Secure Notes - Frontend

React (Vite) + Tailwind CSS. Talks to the Secure Notes REST API.

## Run locally
```bash
npm install
cp .env.example .env     # set VITE_API_URL (e.g. http://localhost:5000/api)
npm run dev              # http://localhost:5173
```

## Deploy (Vercel)
1. Import this repo in Vercel (framework: Vite, build `npm run build`, output `dist`).
2. Add env var `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`.
3. Deploy, then put the Vercel URL into the backend's `CLIENT_URL` on Render.

`vercel.json` rewrites all routes to `index.html` so page refreshes work.
