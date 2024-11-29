import express from "express";
import { client } from "../db/connector.js";
import { ObjectId } from "mongodb";

const router = express.Router();
// routes in this page start with /api/profile

// Get user profile by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching profile for ID:", req.params.id);
    const db = client.db("appDB");
    const usersCollection = db.collection("users");
    const userId = new ObjectId(req.params.id);

    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password from response
    );
    console.log("Found user:", user);

    if (!user) {
      console.log("No user found for ID:", req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
