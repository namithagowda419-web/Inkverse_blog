const Category = require('../models/Category');
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const slugify = require('slugify');

const DEMO_CATEGORIES = [
  {
    _id: 'cat_1',
    name: 'Technology',
    slug: 'technology',
    description: 'Deep dives into artificial intelligence, modern web frameworks, and digital architecture.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    postCount: 2,
  },
  {
    _id: 'cat_2',
    name: 'Design & UX',
    slug: 'design-ux',
    description: 'Principles of sleek aesthetics, micro-interactions, dark mode patterns, and modern web craft.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80',
    postCount: 1,
  },
  {
    _id: 'cat_3',
    name: 'Productivity',
    slug: 'productivity',
    description: 'Actionable workflows, deep work philosophy, and mental models for high performers.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
    postCount: 1,
  },
  {
    _id: 'cat_4',
    name: 'Architecture & Engineering',
    slug: 'architecture',
    description: 'Scalable system design, cloud infrastructure, microservices, and backend performance.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    postCount: 1,
  },
];

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: DEMO_CATEGORIES.length,
        categories: DEMO_CATEGORIES,
      });
    }

    const categories = await Category.find().sort({ name: 1 });

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
    res.status(200).json({
      success: true,
      count: DEMO_CATEGORIES.length,
      categories: DEMO_CATEGORIES,
    });
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
    if (mongoose.connection.readyState === 1) {
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

      return res.status(201).json({
        success: true,
        category,
      });
    }

    const category = {
      _id: 'cat_' + Date.now(),
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
      postCount: 0,
    };

    res.status(201).json({
      success: true,
      category,
    });
  } catch (err) {
    next(err);
  }
};
