import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedOpportunityRoutes from "./routes/savedOpportunityRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        callback(null, true);
        return;
      }

      // Allow configured production/frontend origins.
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Allow localhost during development regardless of port.
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Opportunity Hub API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved", savedOpportunityRoutes);
app.use("/api/profile", profileRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();