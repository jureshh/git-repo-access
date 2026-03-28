

## Add Backend URL

**Single change** in `src/lib/api.ts`:

Update line 1 from:
```ts
const BASE_URL = import.meta.env.VITE_API_URL || "";
```
to:
```ts
const BASE_URL = import.meta.env.VITE_API_URL || "https://lease-extraction-mvp-production.up.railway.app";
```

This way the app will call your Railway backend by default. No `.env` file needed — Lovable doesn't support them. Since this is a public URL (not a secret API key), storing it in code is fine.

