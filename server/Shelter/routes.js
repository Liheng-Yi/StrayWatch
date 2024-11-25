import express from 'express';
import { client } from '../db/connector.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Create new shelter
router.post('/', async (req, res) => {
  try {
    const db = client.db("appDB");
    const sheltersCollection = db.collection("shelters");
    
    // Validate required fields
    if (!req.body.shelterName || !req.body.shelterAddress) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    const newShelter = {
      name: req.body.shelterName,
      address: req.body.shelterAddress,
      phone: req.body.shelterPhone || null,
      email: req.body.shelterEmail || null,
      website: req.body.shelterWebsite || null,
      location: req.body.location ? {
        type: "Point",
        coordinates: req.body.location.coordinates
      } : null,
      pets: [],  // todo: add pets
      userId: null // todo: add user id
    };

    const result = await sheltersCollection.insertOne(newShelter);
    
    if (!result.acknowledged) {
      return res.status(400).json({ message: 'Failed to register shelter' });
    }

    res.status(201).json({ 
      message: 'Shelter registered successfully',
      shelter: { ...newShelter, _id: result.insertedId }
    });
  } catch (err) {
    console.error("Error registering shelter:", err);
    res.status(500).json({ message: "Error registering shelter" });
  }
});

// Get all shelters
router.get('/', async (req, res) => {
  try {
    const db = client.db("appDB");
    const sheltersCollection = db.collection("shelters");
    
    const shelters = await sheltersCollection.find({}).toArray();
    
    res.status(200).json(shelters);
  } catch (err) {
    console.error("Error fetching shelters:", err);
    res.status(500).json({ message: "Error fetching shelters" });
  }
});

export default router;