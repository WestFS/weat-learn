export interface Article {
  id: string;
  title: string;
  author_id: string;
  author: string;
  article_tag: 'movie' | 'notice' | 'journal' | 'tips' | 'cybersecurity' | 'article'; // Change for src/types/article-tag.ts
  summary: string;
  main_image_url?: string | null;
  content: string;
  slug: string; // optimization for SEO Searching ".../how-to-reset-your-password"
  created_at: Date;
  updated_at: Date;
  is_published: boolean;
}


export interface ArticleWithAuthor extends Article {
  author_name: string;
}
