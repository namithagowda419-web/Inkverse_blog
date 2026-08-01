export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  role: 'user' | 'admin';
  followersCount: number;
  followingCount: number;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  postCount?: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: User;
  category: Category;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  readTime: number;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isFeatured?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  blog: string;
  author: User;
  content: string;
  parentComment?: string | null;
  likesCount: number;
  likedBy?: string[];
  isLiked?: boolean;
  isEdited?: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface ChartDataPoint {
  date: string;
  views: number;
  likes: number;
  comments: number;
}

export interface AdminStats {
  totalUsers: number;
  totalBlogs: number;
  totalPublished: number;
  totalDrafts: number;
  totalComments: number;
  totalCategories: number;
}
