# Sidecar

Sidecar is a private YouTube analytics dashboard built with Remix.

## Local Setup

Copy `.env.example` to `.env` and set the Google OAuth client ID and secret from a Google Cloud project with the YouTube Data API and YouTube Analytics API enabled. Add `http://localhost:44100/oauth2/callback` as an authorized redirect URI, then set `GOOGLE_ALLOWED_CHANNEL_ID` to the YouTube channel Sidecar should access. The OAuth callback verifies the selected account can access that channel, and dashboard queries use its channel ID directly.

Generate independent secrets for the cookie session and encrypted token store:

```sh
openssl rand -base64 32
openssl rand -hex 32
```

Use the first value for `SESSION_SECRET` and the second for `TOKEN_ENCRYPTION_KEY`. Keep these values stable: changing the encryption key makes previously stored provider tokens unreadable. The SQLite database is stored in `SIDECAR_DATA_DIR` (defaults to `./tmp/sidecar`). Back up both the database and encryption key together. For deployment, mount persistent storage at that directory and configure the OAuth redirect URI, allowed channel ID, and secrets in the host environment.

Google OAuth consent configured in Testing mode issues refresh tokens that expire after seven days for these YouTube scopes. Set the consent screen to production and complete any Google verification requirements before relying on long-lived production access.

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI.
- `app/actions/public/` contains the browser runtime entry and interactive prompt button.
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to handlers and installs the standard Remix component renderer used by actions.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware.
- Root `public/` contains static files served unchanged from the app root.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
```
