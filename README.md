# Hotel room reservation (Unstop assessment)

Small React app for the hotel booking problem: 97 rooms, lift on the left, book up to 5 rooms with lowest travel time where the rules say same-floor first.

## What you need

- Node 18+ (LTS is fine)

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Other commands

```bash
npm run build    # production build -> dist/
npm run preview  # serve dist locally
npm run lint
```

## Project layout

- `src/App.jsx` – UI, buttons, state
- `src/hotelUtils.js` – room list, travel time, `findBestRooms`
- `src/App.css` – layout / colours

- **Live app:** https://symphonious-sunflower-2a200e.netlify.app/
- **Repo:** https://github.com/anshmittal28/Hotel-room-reservation-system.git
- **Google Doc:** https://docs.google.com/document/d/1Nlirqc9_T9yMFsSKQKzanKAUg1PrtJSZY2Dp84o8gi8/edit?tab=t.0
