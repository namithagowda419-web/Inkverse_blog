const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

// @desc Get system-wide admin stats
// @route GET /api/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalPublished = await Blog.countDocuments({ status: 'published' });
    const totalDrafts = await Blog.countDocuments({ status: 'draft' });
    const totalComments = await Comment.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalPublished,
        totalDrafts,
        totalComments,
        totalCategories,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc Manage / Get all users (Admin only)
// @route GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete user (Admin only)
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only admin user' });
    }

    await Blog.deleteMany({ author: user._id });
    await Comment.deleteMany({ author: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get all posts for admin moderation
// @route GET /api/admin/posts
exports.getAllPostsAdmin = async (req, res, next) => {
  try {
    const posts = await Blog.find()
      .populate('author', 'name username email avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Admin delete post (inappropriate content removal)
// @route DELETE /api/admin/posts/:id
exports.deletePostAdmin = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await Comment.deleteMany({ blog: blog._id });
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inappropriate content removed successfully by admin',
    });
  } catch (err) {
    next(err);
  }
};
