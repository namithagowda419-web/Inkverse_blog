const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const slugify = require('slugify');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collection data...');
    await User.deleteMany();
    await Blog.deleteMany();
    await Category.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await Bookmark.deleteMany();

    console.log('[Seed] Creating demo users...');
    const adminUser = await User.create({
      username: 'admin',
      name: 'Eleanor Vance',
      email: 'admin@maroonblog.com',
      password: 'password123',
      role: 'admin',
      bio: 'Chief Editor & Platform Admin at Maroon Publishing.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    });

    const author1 = await User.create({
      username: 'marcus_dev',
      name: 'Marcus Sterling',
      email: 'marcus@maroonblog.com',
      password: 'password123',
      role: 'user',
      bio: 'Senior Software Architect, AI Enthusiast, and Tech Writer.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    });

    const author2 = await User.create({
      username: 'sophia_design',
      name: 'Sophia Chen',
      email: 'sophia@maroonblog.com',
      password: 'password123',
      role: 'user',
      bio: 'UI/UX Design Director & Minimalist Design Evangelist.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    });

    console.log('[Seed] Creating categories...');
    const categoriesData = [
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
    ];

    const categories = await Category.insertMany(categoriesData);

    const techCat = categories.find((c) => c.slug === 'technology');
    const designCat = categories.find((c) => c.slug === 'design-ux');
    const prodCat = categories.find((c) => c.slug === 'productivity');

    console.log('[Seed] Creating sample blog posts...');
    const blogsData = [
      {
        title: 'The Art of Minimalist UI Architecture in 2026',
        slug: 'the-art-of-minimalist-ui-architecture-in-2026',
        excerpt: 'Explore how refined maroon tones, glassmorphism, and intentional typography elevate modern reading experiences.',
        content: `
# The Art of Minimalist UI Architecture

In an era saturated with sensory overload and noisy interfaces, true visual luxury lies in restraint. When building editorial applications and digital publishing platforms, design systems must prioritize readability, calm composition, and tactile feedback.

## Why Maroon Defines Royal Aesthetics

Maroon (\`#7B1E3A\`) carries a rich heritage of publishing prestige, academic elegance, and royal craftsmanship. Paired with soft blush accents (\`#F4C2C2\`) and deep obsidian tones in dark mode, it creates a comforting sanctuary for avid readers.

### Key Principles of Content-First Engineering:
1. **Typography Hierarchy**: Utilizing crisp sans-serif headings with high-contrast serif body text like Merriweather.
2. **Subtle Motion**: Micro-animations using Framer Motion that guide the reader's line of sight without distracting.
3. **Glassmorphism Navbars**: Translucent navigation bars offering instant spatial awareness across long scrolling articles.

\`\`\`css
/* Custom Royal Maroon Design Token */
.bg-maroon-primary {
  background-color: #7B1E3A;
  box-shadow: 0 10px 30px rgba(123, 30, 58, 0.15);
}
\`\`\`

> "Good design is as little design as possible. Less, but better – because it concentrates on the essential aspects." – Dieter Rams

### Concluding Thoughts

When crafting digital platforms, every pixel should serve the written word. Elevate your interface, respect user attention, and embrace the understated majesty of royal maroon.
        `,
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80',
        author: author2._id,
        category: designCat._id,
        tags: ['Design', 'UX', 'MaroonTheme', 'Frontend'],
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
        excerpt: 'A comprehensive engineering guide on clean Mongoose schemas, JWT refresh tokens, and automated database failovers.',
        content: `
# Building Resilient Full-Stack Systems

Building production-ready web platforms demands end-to-end reliability, scalable data indexing, and graceful error handling under load.

## Architectural Architecture

Our architecture decouples backend REST services from client renderers:

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
    ];

    const createdBlogs = await Blog.insertMany(blogsData);

    console.log('[Seed] Adding sample comments...');
    await Comment.create([
      {
        blog: createdBlogs[0]._id,
        author: author1._id,
        content: 'This maroon design system looks absolutely breathtaking! The glassmorphism header is super smooth.',
        likesCount: 12,
      },
      {
        blog: createdBlogs[0]._id,
        author: adminUser._id,
        content: 'Spot on article, Sophia. High contrast typography makes reading effortless.',
        likesCount: 8,
      },
      {
        blog: createdBlogs[1]._id,
        author: author2._id,
        content: 'Clean code snippets and great database error handling pattern!',
        likesCount: 5,
      },
    ]);

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
