import express from 'express';
import { UserModel } from './model.js';

const router = express.Router();
const userModel = new UserModel();

// signin route
router.post('/signin', async (req, res) => {
  try {
    const user = await userModel.signin(req.body.username, req.body.password);
    res.json(user);
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(err.message.includes('credentials') ? 401 : 500)
       .json({ message: err.message || "Error during signin" });
  }
});

// signup route
router.post('/signup', async (req, res) => {
  try {
    const user = await userModel.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(err.message.includes('exists') ? 400 : 500)
       .json({ message: err.message || "Error creating user" });
  }
});

// update user profile
router.patch('/:id', async (req, res) => {
  try {
    let result;
    if (req.body.$push && req.body.$push.shelters) {
      // Handle shelter array update
      result = await userModel.updateProfile(req.params.id, {
        $push: { shelters: req.body.$push.shelters }
      });
    } else {
      // Handle regular profile updates
      result = await userModel.updateProfile(req.params.id, req.body);
    }
    res.json(result);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(err.message.includes('not found') ? 404 : 500)
       .json({ message: err.message || "Error updating profile" });
  }
});

export default router;