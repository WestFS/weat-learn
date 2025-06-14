export interface Publication {
  id: string;
  title: string;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  slug: string; // optimization for SEO Searching ".../how-to-reset-your-password"
  summary: string;
  content: string;
  imageUrl?: string;
}


