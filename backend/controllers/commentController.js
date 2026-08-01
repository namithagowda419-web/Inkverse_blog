const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc Get comments for a blog post
// @route GET /api/blogs/:blogId/comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Add comment to a blog
// @route POST /api/blogs/:blogId/comments
exports.addComment = async (req, res, next) => {
  try {
    const { content, parentCommentId } = req.body;
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      blog: req.params.blogId,
      author: req.user.id,
      content,
      parentComment: parentCommentId || null,
    });

    blog.commentsCount += 1;
    await blog.save();

    await comment.populate('author', 'name username avatar');

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Edit comment
// @route PUT /api/comments/:id
exports.editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    comment.content = req.body.content || comment.content;
    comment.isEdited = true;
    await comment.save();

    await comment.populate('author', 'name username avatar');

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete comment
// @route DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    const blogId = comment.blog;
    await comment.deleteOne();

    await Blog.findByIdAndUpdate(blogId, { $inc: { commentsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc Toggle Like on Comment
// @route POST /api/comments/:id/like
exports.toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userId = req.user.id;
    const index = comment.likedBy.indexOf(userId);

    if (index > -1) {
      comment.likedBy.splice(index, 1);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likesCount += 1;
    }

    await comment.save();
    res.status(200).json({
      success: true,
      likesCount: comment.likesCount,
      isLiked: index === -1,
    });
  } catch (err) {
    next(err);
  }
};
