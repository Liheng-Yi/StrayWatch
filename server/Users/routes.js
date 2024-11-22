import express from 'express';
import { client } from '../db/connector.js';

const router = express.Router();

// update username
router.patch('/:id', async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.params.id;
        
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const db = client.db("appDB");
        const usersCollection = db.collection("users");
        
        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: { username: username } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Username updated successfully' });
    } catch (err) {
        console.error("Error updating username:", err);
        res.status(500).json({ message: "Error updating username" });
    }
});

export default router;