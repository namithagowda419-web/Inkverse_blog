const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllPostsAdmin,
  deletePostAdmin,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:id', deletePostAdmin);

module.exports = router;
