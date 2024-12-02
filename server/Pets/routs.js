import express from "express";
import { client } from "../db/connector.js";
import { ObjectId } from "mongodb";
import s3Upload from '../config/s3Config.js';

const router = express.Router();

// Configure multer for pet image uploads
const upload = s3Upload;

// Move this route BEFORE the /:id route to prevent conflicts
router.get("/search", async (req, res) => {
  try {
    const { query, criteria } = req.query;
    console.log("Received search query:", query, "criteria:", criteria);
    
    const db = client.db("appDB");
    const petsCollection = db.collection("pets");

    let searchQuery = {};
    if (query && query.trim()) {
      if (criteria && criteria !== 'all') {
        // Specific field search
        searchQuery = { [criteria]: { $regex: new RegExp(query, 'i') } };
      } else {
        // Full-text search across all fields
        searchQuery = { 
          $text: { 
            $search: query,
            $caseSensitive: false,
            $diacriticSensitive: false
          }
        };
      }
    }
    
    console.log("MongoDB search query:", searchQuery);

    const pets = await petsCollection
      .find(searchQuery)
      .sort(criteria === 'all' ? { score: { $meta: "textScore" } } : {})
      .toArray();
    
    console.log("Search results:", pets.length);
    res.json(pets);
  } catch (err) {
    console.error("Error searching pets:", err);
    res.status(500).json({ message: "Error searching pets" });
  }
});

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
    // Add ObjectId validation
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

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
    // Add ObjectId validation
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

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
    res.status(500).json({ message: "Error deleting pet" });
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

// Update pet by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

    const db = client.db("appDB");
    const petsCollection = db.collection("pets");
    const petId = new ObjectId(req.params.id);
    
    const updateData = {
      name: req.body.name,
      kind: req.body.kind,
      color: req.body.color,
      status: req.body.status,
      location: req.body.location,
      description: req.body.description
    };

    if (req.file) {
      updateData.picture = req.file.location;
    }

    const result = await petsCollection.findOneAndUpdate(
      { _id: petId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(result);

  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(500).json({ message: "Error updating pet" });
  }
});

export default router;
