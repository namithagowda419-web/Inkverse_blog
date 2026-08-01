const Category = require('../models/Category');
const Blog = require('../models/Blog');
const slugify = require('slugify');

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Recalculate post counts for precision
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Blog.countDocuments({ category: cat._id, status: 'published' });
        const obj = cat.toObject();
        obj.postCount = count;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Create category (Admin or user)
// @route POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || undefined,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (err) {
    next(err);
  }
};
