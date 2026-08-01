const express = require('express');
const {
  getComments,
  addComment,
  editComment,
  deleteComment,
  toggleCommentLike,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/:blogId/comments', getComments);
router.post('/:blogId/comments', protect, addComment);
router.put('/comments/:id', protect, editComment);
router.delete('/comments/:id', protect, deleteComment);
router.post('/comments/:id/like', protect, toggleCommentLike);

module.exports = router;
