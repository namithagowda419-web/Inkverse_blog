const User = require('../models/User');
const Blog = require('../models/Blog');
const Follow = require('../models/Follow');
const Bookmark = require('../models/Bookmark');

// @desc Get user profile by username
// @route GET /api/users/profile/:username
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const posts = await Blog.find({ author: user._id, status: 'published' })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    let isFollowing = false;
    if (req.user) {
      const followDoc = await Follow.findOne({ follower: req.user.id, following: user._id });
      isFollowing = !!followDoc;
    }

    res.status(200).json({
      success: true,
      user,
      posts,
      isFollowing,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Change Password
// @route PUT /api/users/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc Toggle Follow User
// @route POST /api/users/follow/:id
exports.toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    if (targetUserId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentUser = await User.findById(req.user.id);
    const existingFollow = await Follow.findOne({ follower: req.user.id, following: targetUserId });

    if (existingFollow) {
      await existingFollow.deleteOne();
      targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
      currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
      await targetUser.save();
      await currentUser.save();

      return res.status(200).json({ success: true, isFollowing: false, followersCount: targetUser.followersCount });
    } else {
      await Follow.create({ follower: req.user.id, following: targetUserId });
      targetUser.followersCount += 1;
      currentUser.followingCount += 1;
      await targetUser.save();
      await currentUser.save();

      return res.status(200).json({ success: true, isFollowing: true, followersCount: targetUser.followersCount });
    }
  } catch (err) {
    next(err);
  }
};

// @desc Get user bookmarked posts
// @route GET /api/users/bookmarks
exports.getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).populate({
      path: 'blog',
      populate: [
        { path: 'author', select: 'name username avatar' },
        { path: 'category', select: 'name slug' },
      ],
    });

    const blogs = bookmarks
      .map((b) => b.blog)
      .filter(Boolean)
      .map((b) => {
        const obj = b.toObject();
        obj.isBookmarked = true;
        return obj;
      });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (err) {
    next(err);
  }
};
