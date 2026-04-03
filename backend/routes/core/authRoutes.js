const express = require('express');
const { register, login, logout, getMe, updateProfile, uploadProfileImage, updatePassword } = require('../../controllers/core/authController');
const { protect } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/profileImageMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.put('/update-password', protect, updatePassword);

module.exports = router;
