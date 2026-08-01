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

\`\`\`css
/* InkVerse Design System Token */
.bg-brand-primary {
  background-color: #5B3A8E;
  box-shadow: 0 10px 30px rgba(91, 58, 142, 0.15);
}
\`\`\`

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
    console.log('[DB] Database synchronized successfully.');
  } catch (err) {
    console.error('[DB Error]', err.message);
  }
};
\`\`\`

### Production Readiness Checklist
- Zero unhandled promise rejections
- Express global error middleware with clean JSON error contracts
- Automated seed fallback for zero-downtime local testing
          `,
          coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
          author: author1._id,
          category: techCat._id,
          tags: ['NodeJS', 'MongoDB', 'Architecture', 'TypeScript'],
          status: 'published',
          isFeatured: true,
          views: 980,
          likesCount: 64,
          commentsCount: 2,
          readTime: 5,
        },
        {
          title: 'Mastering Deep Work and Daily Flow in Software Engineering',
          slug: 'mastering-deep-work-and-daily-flow-in-software-engineering',
          excerpt: 'Practical strategies to eliminate context switching, structure uninterrupted coding blocks, and double cognitive output.',
          content: `
# Mastering Deep Work and Daily Flow

Distraction is the single greatest drain on creative momentum. For software engineers and technical writers, sustained focus is a superpower.

## The 90-Minute Focus Protocol

1. **Morning Silence**: Spend the first 2 hours of your day without Slack or Email open.
2. **Single-Task Isolation**: Focus on one architectural problem until resolution.
3. **Intentional Rest**: Take short walks to synthesize ideas naturally.

> "Deep work is the ability to focus without distraction on a cognitively demanding task." – Cal Newport
          `,
          coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
          author: adminUser._id,
          category: prodCat._id,
          tags: ['Productivity', 'DeepWork', 'Mindset', 'Growth'],
          status: 'published',
          isFeatured: false,
          views: 650,
          likesCount: 42,
          commentsCount: 1,
          readTime: 3,
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

const startServer = async () => {
  await connectDB();
  await autoSeed();

  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'online',
      message: 'InkVerse Publishing Platform Unified Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/blogs', require('./routes/blogRoutes'));
  app.use('/api', require('./routes/commentRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/analytics', require('./routes/analyticsRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));

  // Serve static frontend build if present
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
  }

  // SPA Fallback for client routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ success: false, message: 'API Route Not Found' });
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    res.status(404).send('Frontend build not found. Please run `npm run build` in the frontend directory.');
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  INKVERSE UNIFIED SINGLE SERVER ONLINE`);
    console.log(`  Access Application at: http://localhost:${PORT}`);
    console.log(`  REST API available at: http://localhost:${PORT}/api`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
};

startServer();
