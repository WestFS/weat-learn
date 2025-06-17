import { supabase } from "../utils/supabase";
import { Article, ArticleWithAuthor } from "../types/article";
import { UserRole } from "../types";

export interface CreateArticleData {
  title: string;
  content: string;
  author_id: string;
  article_tag: Article['article_tag']
  summary: string;
  main_image_url?: string | null;
  slug?: string;
  is_published?: boolean;
}

export const createArticle = async (articleData: CreateArticleData): Promise<Article> => {
  console.log('[ArticleService] Creating new article:', articleData.title);

  const generatedSlug = articleData.slug || articleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: articleData.title,
        content: articleData.content,
        author_id: articleData.author_id,
        article_tag: articleData.article_tag,
        summary: articleData.summary,
        main_image_url: articleData.main_image_url,
        slug: generatedSlug,
        is_published: articleData.is_published || false,
      })
      .select() // Retorna o artigo inserido
      .single(); // Espera um único resultado

    if (error) {
      console.error('[ArticleService] Supabase insert error:', error.message);
      throw new Error(`Failed to create article: ${error.message}`);
    }

    console.log('[ArticleService] Article created:', data.id);
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  } catch (error: any) {
    console.error('[ArticleService] Failed to create article:', error.message);
    throw error;
  }
};


/**
 * TODO
 * getPublishedArticles
 * getArticleById
 * getAllArticlesForAdmin
 * updateArticle
 * deleteArticle
 */
