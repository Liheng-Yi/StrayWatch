const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.static('uploads'));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded: ${req.file.filename}`);
});

/** route to profile and return user and his pet
 * */ 

// get user info from backend
// const User = mongoose.model('User', UserSchema);
// app.get('/profile/:username', async (req, res) => {
//     try {
//       const user = await User.findOne({ username: req.params.username });
//       if (!user) {
//         return res.status(404).send({ message: 'User not found' });
//       }
//       res.json(user);
//     } catch (error) {
//       res.status(500).send({ message: 'Server error' });
//     }
// });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
