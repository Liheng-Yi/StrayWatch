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

// Get pet by petID
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

// Add pet for user
router.post('/add/:userId', async (req, res) => {
    try {
        const db = client.db("appDB");
        const petsCollection = db.collection("pets");
        
        const newPet = {
            userId: req.params.userId,
            name: req.body.name,
            kind: req.body.kind,
            color: req.body.color,
            status: req.body.status,
            description: req.body.description,
            createdAt: new Date()
        };
        const result = await petsCollection.insertOne(newPet);
        
        if (!result.acknowledged) {
            return res.status(400).json({ message: 'Failed to add pet' });
        }
        console.log('Pet added successfully:',result.insertedId);

        res.status(201).json({ 
            message: 'Pet added successfully',
            pet: { ...newPet, _id: result.insertedId }
        });
    } catch (err) {
        console.error("Error adding pet:", err);
        res.status(500).json({ message: "Error adding pet" });
    }
});

// Get user's pets
router.get('/user/:userId', async (req, res) => {
    try {
        const db = client.db("appDB");
        const petsCollection = db.collection("pets");
        
        const pets = await petsCollection.find({ userId: req.params.userId }).toArray();
        
        if (!pets.length) {
            return res.status(404).json({ message: 'No pets found for this user' });
        }
        
        res.json(pets);
    } catch (err) {
        console.error("Error fetching user's pets:", err);
        res.status(500).json({ message: "Error fetching user's pets" });
    }
});



export default router;

