const express = require('express');
const {
  getUserProfile,
  updateProfile,
  changePassword,
  toggleFollow,
  getUserBookmarks,
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile/:username', optionalAuth, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/follow/:id', protect, toggleFollow);
router.get('/bookmarks', protect, getUserBookmarks);

module.exports = router;
