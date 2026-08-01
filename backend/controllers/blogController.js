const mongoose = require('mongoose');

const DEMO_BLOGS = [
  {
    _id: 'blog_1',
    title: 'The Art of Minimalist UI Architecture in 2026',
    slug: 'the-art-of-minimalist-ui-architecture-in-2026',
    excerpt: 'Explore how refined purple tones, glassmorphism, and intentional typography elevate modern reading experiences on InkVerse.',
    content: `# The Art of Minimalist UI Architecture\n\nIn an era saturated with sensory overload, true visual luxury lies in restraint. When building editorial platforms, design systems must prioritize readability, calm composition, and tactile feedback.`,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80',
    author: { _id: 'u1', name: 'Sophia Chen', username: 'sophia_design', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
    category: { _id: 'cat_2', name: 'Design & UX', slug: 'design-ux' },
    tags: ['Design', 'UX', 'InkVerse'],
    status: 'published',
    isFeatured: true,
    views: 1420,
    likesCount: 89,
    commentsCount: 3,
    readTime: 4,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'blog_2',
    title: 'Building Resilient Full-Stack Systems with Node.js and MongoDB',
    slug: 'building-resilient-full-stack-systems-with-nodejs-and-mongodb',
    excerpt: 'A comprehensive engineering guide on clean Mongoose schemas, JWT refresh tokens, and single-server unified architectures.',
    content: `# Building Resilient Full-Stack Systems\n\nBuilding production-ready web platforms demands end-to-end reliability, scalable data indexing, and graceful error handling under load.`,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
    author: { _id: 'u2', name: 'Marcus Sterling', username: 'marcus_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    category: { _id: 'cat_1', name: 'Technology', slug: 'technology' },
    tags: ['Nodejs', 'Backend', 'Architecture'],
    status: 'published',
    isFeatured: false,
    views: 940,
    likesCount: 54,
    commentsCount: 2,
    readTime: 6,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'blog_3',
    title: 'The Deep Work Habit: Cultivating Uninterrupted Focus',
    slug: 'the-deep-work-habit-cultivating-uninterrupted-focus',
    excerpt: 'Mastering cognitive focus in a hyper-connected world. Practical strategies for knowledge workers and software engineers.',
    content: `# The Deep Work Habit\n\nDeep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that allows you to quickly master complicated information and produce better results in less time.`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
    author: { _id: 'u3', name: 'Eleanor Vance', username: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    category: { _id: 'cat_3', name: 'Productivity', slug: 'productivity' },
    tags: ['Productivity', 'Focus'],
    status: 'published',
    isFeatured: false,
    views: 610,
    likesCount: 42,
    commentsCount: 1,
    readTime: 5,
    createdAt: new Date().toISOString(),
  },
];

// Helper reading time calculator
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// @desc Get all blogs (Search, Category, Tags, Pagination, Sorting)
// @route GET /api/blogs
exports.getBlogs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: DEMO_BLOGS.length,
        pagination: { page: 1, limit: 9, totalPages: 1, total: DEMO_BLOGS.length },
        blogs: DEMO_BLOGS,
      });
    }
    const { search, category, tag, author, status, sort, page = 1, limit = 9, featured } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'published';
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (author) {
      query.author = author;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular' || sort === 'trending') {
      sortOption = { views: -1, likesCount: -1 };
    } else if (sort === 'likes') {
      sortOption = { likesCount: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .populate('author', 'name username avatar bio followersCount')
      .populate('category', 'name slug image')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Check user likes/bookmarks if logged in
    let likedBlogIds = new Set();
    let bookmarkedBlogIds = new Set();

    if (req.user) {
      const blogIds = blogs.map((b) => b._id);
      const userLikes = await Like.find({ user: req.user.id, blog: { $in: blogIds } });
      const userBookmarks = await Bookmark.find({ user: req.user.id, blog: { $in: blogIds } });

      likedBlogIds = new Set(userLikes.map((l) => l.blog.toString()));
      bookmarkedBlogIds = new Set(userBookmarks.map((b) => b.blog.toString()));
    }

    const blogsFormatted = blogs.map((b) => {
      const obj = b.toObject();
      obj.isLiked = likedBlogIds.has(b._id.toString());
      obj.isBookmarked = bookmarkedBlogIds.has(b._id.toString());
      return obj;
    });

    res.status(200).json({
      success: true,
      count: blogsFormatted.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      blogs: blogsFormatted,
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      count: DEMO_BLOGS.length,
      pagination: { page: 1, limit: 9, totalPages: 1, total: DEMO_BLOGS.length },
      blogs: DEMO_BLOGS,
    });
  }
};

// @desc Get single blog by slug
// @route GET /api/blogs/:slug
exports.getBlogBySlug = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const demo = DEMO_BLOGS.find((b) => b.slug === req.params.slug) || DEMO_BLOGS[0];
      return res.status(200).json({
        success: true,
        blog: demo,
        recommended: DEMO_BLOGS.filter((b) => b.slug !== demo.slug),
      });
    }

    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name username avatar bio followersCount followingCount')
      .populate('category', 'name slug description image');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    let isLiked = false;
    let isBookmarked = false;

    if (req.user) {
      const likeExists = await Like.findOne({ user: req.user.id, blog: blog._id });
      const bookmarkExists = await Bookmark.findOne({ user: req.user.id, blog: blog._id });
      isLiked = !!likeExists;
      isBookmarked = !!bookmarkExists;
    }

    // Fetch recommended posts from same category
    const recommended = await Blog.find({
      category: blog.category?._id,
      _id: { $ne: blog._id },
      status: 'published',
    })
      .limit(3)
      .populate('author', 'name username avatar');

    res.status(200).json({
      success: true,
      blog: {
        ...blog.toObject(),
        isLiked,
        isBookmarked,
      },
      recommended,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Create blog post
// @route POST /api/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, categoryId, tags, status, isFeatured } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({ success: false, message: 'Please provide title, content and category' });
    }

    let baseSlug = slugify(title, { lower: true, strict: true }) || 'post-' + Date.now();
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const computedExcerpt = excerpt || content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
    const readTime = calculateReadTime(content);

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim())
      : [];

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt: computedExcerpt,
      coverImage: coverImage || undefined,
      author: req.user.id,
      category: categoryId,
      tags: parsedTags,
      status: status || 'published',
      readTime,
      isFeatured: !!isFeatured,
    });

    // Update Category postCount
    await Category.findByIdAndUpdate(categoryId, { $inc: { postCount: 1 } });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update blog post
// @route PUT /api/blogs/:id
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this blog' });
    }

    const { title, content, excerpt, coverImage, categoryId, tags, status, isFeatured } = req.body;

    if (title && title !== blog.title) {
      let baseSlug = slugify(title, { lower: true, strict: true }) || 'post-' + Date.now();
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      blog.slug = slug;
      blog.title = title;
    }

    if (content) {
      blog.content = content;
      blog.readTime = calculateReadTime(content);
    }

    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (coverImage) blog.coverImage = coverImage;
    if (categoryId) blog.category = categoryId;
    if (status) blog.status = status;
    if (isFeatured !== undefined) blog.isFeatured = isFeatured;
    if (tags) {
      blog.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete blog post
// @route DELETE /api/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    await Category.findByIdAndUpdate(blog.category, { $inc: { postCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc Upload blog cover or content image
// @route POST /api/blogs/upload-image
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    url: fileUrl,
  });
};

// @desc Toggle Like on Blog
// @route POST /api/blogs/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const existingLike = await Like.findOne({ user: req.user.id, blog: blog._id });

    if (existingLike) {
      await existingLike.deleteOne();
      blog.likesCount = Math.max(0, blog.likesCount - 1);
      await blog.save();
      return res.status(200).json({ success: true, isLiked: false, likesCount: blog.likesCount });
    } else {
      await Like.create({ user: req.user.id, blog: blog._id });
      blog.likesCount += 1;
      await blog.save();
      return res.status(200).json({ success: true, isLiked: true, likesCount: blog.likesCount });
    }
  } catch (err) {
    next(err);
  }
};

// @desc Toggle Bookmark on Blog
// @route POST /api/blogs/:id/bookmark
exports.toggleBookmark = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const existingBookmark = await Bookmark.findOne({ user: req.user.id, blog: blog._id });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      blog.bookmarksCount = Math.max(0, blog.bookmarksCount - 1);
      await blog.save();
      return res.status(200).json({ success: true, isBookmarked: false });
    } else {
      await Bookmark.create({ user: req.user.id, blog: blog._id });
      blog.bookmarksCount += 1;
      await blog.save();
      return res.status(200).json({ success: true, isBookmarked: true });
    }
  } catch (err) {
    next(err);
  }
};
