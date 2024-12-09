import express from 'express';
import { client } from '../db/connector.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
// routes in this page start with /api/profile


// get user profile by userId
router.get('/:userId',async (req,res)=>{
    try {
        const db = client.db("appDB");
        const usersCollection = db.collection("users");
        const objectId = new ObjectId(req.params.userId);
        const user = await usersCollection.findOne({ _id: objectId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Error fetching user" });
    }
})

export default router;

