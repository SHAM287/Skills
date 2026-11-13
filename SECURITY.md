# Weather API key security

The weather dashboard calls OpenWeather directly from the browser. Any API key embedded in client-side JavaScript is visible to visitors and must be treated as public.

## Recommended actions

1. Revoke any exposed key and create a replacement.
2. Do not commit the replacement key or embed it in browser JavaScript.
3. For production, route requests through a server-side endpoint and store the key in a deployment secret. For a browser-only prototype, use provider-side restrictions and usage limits where available, while remembering that these do not make a client-side key secret.

Never put real credentials in this document or in source control.