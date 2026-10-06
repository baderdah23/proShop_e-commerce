import app from "../src/server.js";

// Vercel serverless entrypoint. vercel.json rewrites every request to
// this function, which serves the full Express app built in src/server.ts.
export default app;