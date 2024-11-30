import express from "express";
import { client } from "../db/connector.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for pet image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./pic";
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all pets or filter by type
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const db = client.db("appDB");
    const petsCollection = db.collection("pets");

    let query = {};
    if (type && type !== "all") {
      query = { kind: { $regex: new RegExp(type, "i") } };
    }

    const pets = await petsCollection.find(query).toArray();
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ message: "Error fetching pets" });
  }
});

// Get pet by petID
router.get("/:id", async (req, res) => {
  try {
    const db = client.db("appDB");
    const petsCollection = db.collection("pets");
    const petId = new ObjectId(req.params.id);
    const pet = await petsCollection.findOne({ _id: petId });
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (err) {
    console.error("Error fetching pet:", err);
    res.status(500).json({ message: "Error fetching pet" });
  }
});

// delete pet by petID
router.delete("/:id", async (req, res) => {
  try {
    const db = client.db("appDB");
    const petsCollection = db.collection("pets");
    const petId = new ObjectId(req.params.id);
    const result = await petsCollection.deleteOne({ _id: petId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    console.error("Error deleting pet:", err);
  }
});

// Add pet for user with image upload
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const db = client.db("appDB"); // Added: Get DB reference
    const petsCollection = db.collection("pets"); // Added: Get collection reference

    const petData = {
      ...req.body,
      userId: new ObjectId(req.body.userId), // Added: Convert userId to ObjectId
      image: req.file ? req.file.path : null, // Added: Handle image path
      createdAt: new Date(), // Added: Timestamp
    };

    const result = await petsCollection.insertOne(petData); // Changed: Using MongoDB native operation

    res.status(201).json({
      // Added: Better response structure
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get user's pets by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const db = client.db("appDB");
    const petsCollection = db.collection("pets");
    const userObjectId = new ObjectId(req.params.userId);
    const pets = await petsCollection.find({ userId: userObjectId }).toArray();

    if (!pets.length) {
      return res.status(404).json({ message: "No pets found for this user" });
    }

    res.json(pets);
  } catch (err) {
    console.error("Error fetching user's pets:", err);
    res.status(500).json({ message: "Error fetching user's pets" });
  }
});

export default router;
