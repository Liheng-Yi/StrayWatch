import express from "express";
import { client } from "../db/connector.js";
import { ObjectId } from "mongodb";
import s3Upload from '../config/s3Config.js';

const router = express.Router();

// Configure multer for pet image uploads
const upload = s3Upload;

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
    const db = client.db("appDB");
    const petsCollection = db.collection("pets");

    const petData = {
      ...req.body,
      userId: new ObjectId(req.body.userId),
      picture: req.file ? req.file.location : null,
      createdAt: new Date(),
    };

    const result = await petsCollection.insertOne(petData);

    res.status(201).json({
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
