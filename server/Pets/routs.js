import express from 'express';
import { client } from '../db/connector.js';

const router = express.Router();

// Get all pets or filter by type
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const db = client.db("appDB");
        const petsCollection = db.collection("pets");
        
        let query = {};
        if (type && type !== 'all') {
            query = { kind: { $regex: new RegExp(type, 'i') } };
        }
        
        const pets = await petsCollection.find(query).toArray();
        res.json(pets);
    } catch (err) {
        console.error("Error fetching pets:", err);
        res.status(500).json({ message: "Error fetching pets" });
    }
});

// Get pet by ID
router.get('/:id', async (req, res) => {
    try {
        const db = client.db("appDB");
        const petsCollection = db.collection("pets");
        
        const pet = await petsCollection.findOne({ _id: req.params.id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (err) {
        console.error("Error fetching pet:", err);
        res.status(500).json({ message: "Error fetching pet" });
    }
});

export default router;

