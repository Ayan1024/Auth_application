// server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

/* -----------------------------------------
   Build allowed origins (env or defaults)
-------------------------------------------*/
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://auth-application-y5oy.onrender.com",
];

const raw = process.env.CORS_ORIGINS || DEFAULT_ORIGINS.join(",");
let ALLOWED_ORIGINS = raw.split(",").map((o) => o.trim()).filter(Boolean);

// Ensure server's own origin is allowed when running locally in production mode
const serverLocalOrigins = [
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
];

// Add serverLocalOrigins if not present
serverLocalOrigins.forEach((o) => {
  if (!ALLOWED_ORIGINS.includes(o)) ALLOWED_ORIGINS.push(o);
});

console.log("Allowed CORS origins:", ALLOWED_ORIGINS);

/* -----------------------------------------
   CORS Options (dynamic origin echo)
-------------------------------------------*/
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (curl/postman) where origin is undefined
    if (!origin) return callback(null, true);

    // allow if origin is in the whitelist
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Optionally allow any other localhost:* (broad, use if you develop a lot)
    const isLocalhostOrigin =
      origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
    if (isLocalhostOrigin) {
      // you can decide to allow all localhost origins — here we allow them
      console.warn("Allowing localhost origin dynamically:", origin);
      return callback(null, true);
    }

    console.warn("❌ Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow cookies/credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Apply CORS early
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight handling

/* -----------------------------------------
   Middlewares
-------------------------------------------*/
app.use(express.json());
app.use(cookieParser());

/* -----------------------------------------
   API Routes
-------------------------------------------*/
app.use("/api/users", userRoutes);

/* -----------------------------------------
   Serve frontend build in production
-------------------------------------------*/
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/* -----------------------------------------
   Global error handler
-------------------------------------------*/
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err?.message || err);
  // In CORS origin callback we may get an Error - send 403 for that
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS origin forbidden" });
  }
  res.status(500).json({ error: err?.message || "Server error" });
});

/* -----------------------------------------
   Start server
-------------------------------------------*/
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
