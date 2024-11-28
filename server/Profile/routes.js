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

// // get current user's profile
// router.get('/', async (req, res) => {
//     try {
//         // TODO: Get current user ID from auth token/session
//         const currentUserId = req.user?._id; // Assuming auth middleware sets req.user
        
//         if (!currentUserId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }
//         const db = client.db("appDB");
//         const usersCollection = db.collection("users");
//         const currentUserObjectId = new ObjectId(currentUserId.toString());
//         const user = await usersCollection.findOne({ _id: currentUserObjectId });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user);
//     } catch (err) {
//         console.error("Error fetching current user:", err);
//         res.status(500).json({ message: "Error fetching user profile" });
//     }
// });
export default router;

