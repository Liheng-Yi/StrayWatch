import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { connectToDb } from "./db/connector.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Routes
import petsRoutes from "./Pets/routs.js";
import profileRoutes from "./Profile/routes.js";
import userRoutes from "./Users/routes.js";
import shelterRoutes from "./Shelter/routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["https://straywatch.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectToDb()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });

app.use(express.static("uploads"));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded: ${req.file.filename}`);
});

app.use("/api/pets", petsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shelters", shelterRoutes);

app.use("/Pets/pic", express.static("Pets/pic"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
