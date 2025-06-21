import { getSupabaseClient } from "../utils/supabase";
import { Article, ArticleWithAuthor } from "../types/article";

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
    const supabase = await getSupabaseClient();
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

export const getPublishedArticles =  async (): Promise<ArticleWithAuthor[]> => {
  console.log('[ArticleService] Fetching published articles...');
  try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*, profiles(full_name)')
        .eq('is_published', true)
        .order('created_at', {ascending: false});

      if(error) {
        console.error('[ArticleService] Supabase fetch error:', error.message);
        throw new Error(`Failed to fetch articles: ${error.message}`);
      }

      return data?.map(item => ({
        ...item,
        author_name: item.profiles ? item.profiles.full_name : 'Unknowwn',
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
        summary: item.summary,
        imageUrl: item.main_image_url || undefined,


      })) as ArticleWithAuthor[];

  } catch (error: any) {
    console.error('[ArticleService] Failed to get published articles:', error.message);
    throw error;
  }
};

export const getArticleByID = async (id: string): Promise<ArticleWithAuthor[] | null> => {
  console.log(`[ArticleService] Fetching article by ID: ${id}...`);
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[ArticleService] Supabase fetch by ID error:', error.message);
      throw new Error(`Failed to fetch article by ID: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      author_name: data.profiles ? data.profiles.full_name : 'Unknowwn',
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    } as ArticleWithAuthor[]

  } catch (error: any) {
    console.error(`[ArticleService] Failed to get article by ID ${id}:`, error.message);
    throw error;
  }
};

export const updateArticle = async (id: string, updates: Partial<Article>): Promise<Article> => {
    console.log(`[ArticleService] Updating article ${id}:`, updates);
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('articles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[ArticleService] Supabase update error:', error.message);
            throw new Error(`Failed to update article: ${error.message}`);
        }

        console.log('[ArticleService] Article updated:', data.id);
        return {
            ...data,
            updated_at: new Date(data.updated_at),
        };
    } catch (error: any) {
        console.error(`[ArticleService] Failed to update article ${id}:`, error.message);
        throw error;
    }
};

export const deleteArticle = async (id: string): Promise<void> => {
    console.log(`[ArticleService] Deleting article ${id}...`);
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[ArticleService] Supabase delete error:', error.message);
            throw new Error(`Failed to delete article: ${error.message}`);
        }

        console.log(`[ArticleService] Article ${id} deleted successfully.`);
    } catch (error: any) {
        console.error(`[ArticleService] Failed to delete article ${id}:`, error.message);
        throw error;
    }
};

/**
 * TODO
 * getAllArticlesForAdmin
 */
