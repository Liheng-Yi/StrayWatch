import express from 'express';
import { PetModel } from './model.js';
import s3Upload from '../config/s3Config.js';

const router = express.Router();
const petModel = new PetModel();
const upload = s3Upload;

// Search pets
router.get("/search", async (req, res) => {
  try {
    const { query, criteria } = req.query;
    console.log("Received search query:", query, "criteria:", criteria);
    
    const pets = await petModel.searchPets(query, criteria);
    console.log("Search results:", pets.length);
    res.json(pets);
  } catch (err) {
    console.error("Error searching pets:", err);
    res.status(500).json({ message: err.message || "Error searching pets" });
  }
});

// Get all pets or filter by type
router.get("/", async (req, res) => {
  try {
    const pets = await petModel.getAllPets(req.query.type);
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ message: err.message || "Error fetching pets" });
  }
});

// Get pet by ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await petModel.getPetById(req.params.id);
    res.json(pet);
  } catch (err) {
    console.error("Error fetching pet:", err);
    res.status(err.message.includes('Invalid') ? 400 : 500)
       .json({ message: err.message || "Error fetching pet" });
  }
});

// Delete pet by ID
router.delete("/:id", async (req, res) => {
  try {
    await petModel.deletePet(req.params.id);
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(err.message.includes('Invalid') ? 400 : 404)
       .json({ message: err.message || "Error deleting pet" });
  }
});

// Add pet with image upload
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const result = await petModel.createPet(req.body, req.file);
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

// Get user's pets
router.get("/user/:userId", async (req, res) => {
  try {
    const pets = await petModel.getUserPets(req.params.userId);
    res.json(pets);
  } catch (err) {
    console.error("Error fetching user's pets:", err);
    res.status(err.message.includes('Invalid') ? 400 : 404)
       .json({ message: err.message || "Error fetching user's pets" });
  }
});

// Update pet
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const result = await petModel.updatePet(req.params.id, req.body, req.file);
    res.json(result);
  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(err.message.includes('Invalid') ? 400 : 500)
       .json({ message: err.message || "Error updating pet" });
  }
});

export default router;