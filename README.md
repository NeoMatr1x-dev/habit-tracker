# Habit Tracker React

A brand-new React + TypeScript habit tracker built with Vite.

Features:
- Add habits with emoji-enhanced titles
- Choose gradient themes and accent colors
- Upload custom image or video wallpapers
- Slide to complete habits and delete cards
- Save habits, wallpaper, and theme in local storage

## Getting Started

1. Open `habit-tracker-react` in your terminal
2. Install dependencies: `npm install` (or `pnpm install`/`yarn`)
3. Start the dev server: `npm run dev`

Local OAuth server (optional)

1. Create a `.env` file in `server/` with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK`, and `SESSION_SECRET`.
2. From the `habit-tracker-react` folder, install dependencies and start the server:

```bash
npm install
node server/index.ts
```

The server is a scaffold showing how to wire Google OAuth with `passport-google-oauth20`. Configure the Google Cloud Console OAuth redirect to the callback URL you set in `.env`.

## Project Structure

- `src/` - React source files
- `src/components/` - UI components
- `public/` - static assets folder

Enjoy building your next-level habit tracker!
