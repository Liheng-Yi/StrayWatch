import express from 'express';
import { client } from '../db/connector.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const router = express.Router();
// routes in this page start with /api/users
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const db = client.db("appDB");
        const usersCollection = db.collection("users");
        
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // In production, you should compare hashed passwords
        // const isValidPassword = await bcrypt.compare(password, user.password);
        const isValidPassword = password === user.password; // Temporary direct comparison

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userWithoutPassword = {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        res.json(userWithoutPassword);
    } catch (err) {
        console.error("Error during signin:", err);
        res.status(500).json({ message: "Error during signin" });
    }
});
// update user profile
router.patch('/:id', async (req, res) => {
    try {
        const { username,email,phone } = req.body;
        const userId = new ObjectId(req.params.id);
        const db = client.db("appDB");
        const usersCollection = db.collection("users");

        const updateFields = { }; // Initialize
        if (username) updateFields.username = username;
        if (email) updateFields.email = email; // Only add if email is not an empty string
        if (phone) updateFields.phone = phone; 
        
        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'profile updated now!' });
    } catch (err) {
        console.error("Error updating username:", err);
        res.status(500).json({ message: "Error updating username" });
    }
});

// signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, password, email, phone, role = "user" } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Username, password, and email are required' });
        }

        const db = client.db("appDB");
        const usersCollection = db.collection("users");
        
        // Check if username or email already exists
        const existingUser = await usersCollection.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const result = await usersCollection.insertOne({
            username,
            password, // Note: In production, hash the password before storing
            email,
            phone,
            role,
            createdAt: new Date()
        });

        const userWithoutPassword = {
            _id: result.insertedId,
            username,
            email,
            phone,
            role
        };

        res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ message: "Error creating user" });
    }
});

// signin route
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const db = client.db("appDB");
        const usersCollection = db.collection("users");
        
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // In production, you should compare hashed passwords
        // const isValidPassword = await bcrypt.compare(password, user.password);
        const isValidPassword = password === user.password; // Temporary direct comparison

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userWithoutPassword = {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        res.json(userWithoutPassword);
    } catch (err) {
        console.error("Error during signin:", err);
        res.status(500).json({ message: "Error during signin" });
    }
});

export default router;