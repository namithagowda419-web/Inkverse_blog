const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Category = require('./models/Category');
const Comment = require('./models/Comment');

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health endpoint (supports both /health and /api/health)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'InkVerse Publishing Platform Server is running',
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes (supports both Vercel stripped routes and direct /api prefix)
app.use(['/auth', '/api/auth'], require('./routes/authRoutes'));
app.use(['/blogs', '/api/blogs'], require('./routes/blogRoutes'));
app.use(['/comments', '/api/comments', '/api'], require('./routes/commentRoutes'));
app.use(['/users', '/api/users'], require('./routes/userRoutes'));
app.use(['/categories', '/api/categories'], require('./routes/categoryRoutes'));
app.use(['/analytics', '/api/analytics'], require('./routes/analyticsRoutes'));
app.use(['/admin', '/api/admin'], require('./routes/adminRoutes'));

// Serve static frontend build locally when running in local unified server mode
if (!process.env.VERCEL) {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
  }

  app.get('*', (req, res) => {
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    res.status(404).json({ success: false, message: 'InkVerse API Endpoint Not Found' });
  });
} else {
  app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'InkVerse API Route Not Found' });
  });
}

app.use(errorHandler);

// Auto-seed function to ensure demo content exists on startup
const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Populating initial demo data for InkVerse...');
      const adminUser = await User.create({
        username: 'admin',
        name: 'Eleanor Vance',
        email: 'admin@inkverse.com',
        password: 'password123',
        role: 'admin',
        bio: 'Chief Editor & Platform Director at InkVerse Publishing.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      });

      const author1 = await User.create({
        username: 'marcus_dev',
        name: 'Marcus Sterling',
        email: 'marcus@inkverse.com',
        password: 'password123',
        role: 'user',
        bio: 'Senior Software Architect, AI Enthusiast, and Tech Writer.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      });

      const author2 = await User.create({
        username: 'sophia_design',
        name: 'Sophia Chen',
        email: 'sophia@inkverse.com',
        password: 'password123',
        role: 'user',
        bio: 'UI/UX Design Director & Minimalist Design Evangelist.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      });

      const categories = await Category.insertMany([
        {
          name: 'Technology',
          slug: 'technology',
          description: 'Deep dives into artificial intelligence, modern web frameworks, and digital architecture.',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Design & UX',
          slug: 'design-ux',
          description: 'Principles of sleek aesthetics, micro-interactions, dark mode patterns, and modern web craft.',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Productivity',
          slug: 'productivity',
          description: 'Actionable workflows, deep work philosophy, and mental models for high performers.',
          image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
        },
        {
          name: 'Architecture & Engineering',
          slug: 'architecture',
          description: 'Scalable system design, cloud infrastructure, microservices, and backend performance.',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
        },
      ]);

      const techCat = categories.find((c) => c.slug === 'technology');
      const designCat = categories.find((c) => c.slug === 'design-ux');
      const prodCat = categories.find((c) => c.slug === 'productivity');

      const blogs = await Blog.insertMany([
        {
          title: 'The Art of Minimalist UI Architecture in 2026',
          slug: 'the-art-of-minimalist-ui-architecture-in-2026',
          excerpt: 'Explore how refined purple tones, glassmorphism, and intentional typography elevate modern reading experiences on InkVerse.',
          content: `
# The Art of Minimalist UI Architecture

In an era saturated with sensory overload and noisy interfaces, true visual luxury lies in restraint. When building editorial applications and digital publishing platforms, design systems must prioritize readability, calm composition, and tactile feedback.

## Why Deep Purple Defines Modern Knowledge Aesthetics

Deep Purple (\`#5B3A8E\`) carries a rich heritage of digital elegance, modern software craft, and linear simplicity. Paired with violet accents (\`#A78BFA\`) and deep obsidian slate tones in dark mode, it creates a comforting sanctuary for avid readers.

### Key Principles of Content-First Engineering:
1. **Typography Hierarchy**: Utilizing crisp sans-serif headings with high-contrast serif body text like Merriweather.
2. **Subtle Motion**: Micro-animations using Framer Motion that guide the reader's line of sight without distracting.
3. **Glassmorphism Navbars**: Translucent navigation bars offering instant spatial awareness across long scrolling articles.

> "Good design is as little design as possible. Less, but better – because it concentrates on the essential aspects." – Dieter Rams

### Concluding Thoughts

When crafting digital platforms, every pixel should serve the written word. Elevate your interface, respect user attention, and embrace the understated majesty of InkVerse.
          `,
          coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80',
          author: author2._id,
          category: designCat._id,
          tags: ['Design', 'UX', 'InkVerse', 'Frontend'],
          status: 'published',
          isFeatured: true,
          views: 1420,
          likesCount: 89,
          commentsCount: 3,
          readTime: 4,
        },
        {
          title: 'Building Resilient Full-Stack Systems with Node.js and MongoDB',
          slug: 'building-resilient-full-stack-systems-with-nodejs-and-mongodb',
          excerpt: 'A comprehensive engineering guide on clean Mongoose schemas, JWT refresh tokens, and single-server unified architectures.',
          content: `
# Building Resilient Full-Stack Systems

Building production-ready web platforms demands end-to-end reliability, scalable data indexing, and graceful error handling under load.

## Architectural Architecture

Our architecture integrates backend REST services with static client renderers into a single unified server:

- **Express.js API Router**: Handles authentication, blog CRUD operations, and social interactions.
- **Mongoose ORM**: Enforces strict schema validations and relational population across Users, Blogs, and Comments.
- **JWT Authorization**: Features short-lived access tokens and secure refresh mechanisms.

\`\`\`javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected');
  } catch (err) {
    console.error(err);
  }
};
\`\`\`

## System Benchmarks

By eliminating CORS overhead and serving client bundles directly from the primary HTTP port, initial payload latency is reduced significantly.
          `,
          coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
          author: author1._id,
          category: techCat._id,
          tags: ['Nodejs', 'Backend', 'MongoDB', 'Architecture'],
          status: 'published',
          isFeatured: false,
          views: 940,
          likesCount: 54,
          commentsCount: 2,
          readTime: 6,
        },
        {
          title: 'The Deep Work Habit: Cultivating Uninterrupted Focus',
          slug: 'the-deep-work-habit-cultivating-uninterrupted-focus',
          excerpt: 'Mastering cognitive focus in a hyper-connected world. Practical strategies for knowledge workers and software engineers.',
          content: `
# The Deep Work Habit

Deep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that allows you to quickly master complicated information and produce better results in less time.

## Key Rituals for Deep Work:
- **Time-blocking**: Schedule specific blocks for deep work vs shallow tasks.
- **Digital Sunset**: Turn off notifications after hours to allow cognitive recovery.
- **Environment Design**: Dedicated reading and writing space free from social media alerts.
          `,
          coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
          author: adminUser._id,
          category: prodCat._id,
          tags: ['Productivity', 'Focus', 'Writing'],
          status: 'published',
          isFeatured: false,
          views: 610,
          likesCount: 42,
          commentsCount: 1,
          readTime: 5,
        },
      ]);

      await Comment.create([
        {
          blog: blogs[0]._id,
          author: author1._id,
          content: 'This InkVerse purple design system looks clean and modern! The typography and single-server setup are top-notch.',
          likesCount: 12,
        },
        {
          blog: blogs[0]._id,
          author: adminUser._id,
          content: 'Spot on article, Sophia. High contrast readability makes writing on InkVerse an absolute pleasure.',
          likesCount: 8,
        },
      ]);

      console.log('[AutoSeed] InkVerse demo content seeded successfully.');
    }
  } catch (err) {
    console.error('[AutoSeed Error]', err);
  }
};

// Initialize DB asynchronously for local development or when MONGODB_URI is provided
if (!process.env.VERCEL) {
  connectDB().then(() => autoSeed()).catch((err) => console.error('[DB Init Error]', err));
} else if (process.env.MONGODB_URI) {
  connectDB().catch((err) => console.error('[DB Init Error]', err));
}

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  INKVERSE UNIFIED SINGLE SERVER ONLINE`);
    console.log(`  Access Application at: http://localhost:${PORT}`);
    console.log(`  REST API available at: http://localhost:${PORT}/api`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
