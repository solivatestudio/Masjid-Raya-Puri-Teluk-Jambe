import { getSql } from '@/db';

export interface PublicKajian {
  id: string;
  title: string;
  category: 'Dakwah' | 'Dauroh';
  date_label: string;
  date_start: string | null;
  time_label: string;
  speaker: string | null;
  location: string;
  description: string | null;
  image_url: string | null;
  capacity: number | null;
  registered_count: number;
  is_recurring: boolean;
}

export interface PublicKhutbah {
  id: string;
  schedule_date: string;
  khatib: string;
  muadzin: string | null;
  theme: string | null;
}

export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html?: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string;
  views_count: number;
  author_name: string | null;
}

export async function getPublicKajian(category?: string): Promise<PublicKajian[]> {
  try {
    const sql = getSql();
    const params: any[] = [];
    let where = 'WHERE is_published = TRUE';
    if (category && category !== 'Semua') {
      params.push(category);
      where += ` AND category = $1`;
    }
    const rows = (await (sql as any).query(
      `SELECT id, title, category, date_label, date_start, time_label, speaker, location, description, image_url, capacity, registered_count, is_recurring
       FROM kajian ${where}
       ORDER BY date_start DESC NULLS LAST, created_at DESC LIMIT 50`,
      params
    )) as any[];
    return rows;
  } catch {
    return [];
  }
}

export async function getPublicKhutbah(limit = 4): Promise<PublicKhutbah[]> {
  try {
    const sql = getSql();
    const rows = (await (sql as any).query(
      `SELECT id, schedule_date, khatib, muadzin, theme FROM khutbah_schedule WHERE schedule_date >= CURRENT_DATE ORDER BY schedule_date ASC LIMIT $1`,
      [limit]
    )) as any[];
    return rows;
  } catch {
    return [];
  }
}

export async function getPublicArticles(opts: { category?: string; search?: string; page?: number } = {}): Promise<{ articles: PublicArticle[]; total: number; page: number; limit: number }> {
  try {
    const sql = getSql();
    const category = opts.category;
    const search = opts.search || '';
    const limit = 12;
    const page = Math.max(1, opts.page || 1);
    const offset = (page - 1) * limit;
    const conditions = ["a.status = 'published'"];
    const params: any[] = [];
    let idx = 1;
    if (category && category !== 'Semua') {
      conditions.push(`a.category = $${idx++}`);
      params.push(category);
    }
    if (search) {
      conditions.push(`(a.title ILIKE '%' || $${idx++} || '%' OR a.excerpt ILIKE '%' || $${idx++} || '%')`);
      params.push(search, search);
    }
    const where = `WHERE ${conditions.join(' AND ')}`;
    const rows = (await (sql as any).query(
      `SELECT a.id, a.slug, a.title, a.excerpt, a.featured_image_url, a.featured_image_alt, a.category, a.tags, a.published_at, a.views_count, u.name as author_name
       FROM articles a LEFT JOIN users u ON u.id = a.author_id
       ${where}
       ORDER BY a.published_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    )) as any[];
    const countRows = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM articles a ${where}`, params)) as any[];
    return { articles: rows, total: countRows[0]?.c || 0, page, limit };
  } catch {
    return { articles: [], total: 0, page: 1, limit: 12 };
  }
}

export async function getPublicArticleBySlug(slug: string): Promise<(PublicArticle & { content_html: string }) | null> {
  try {
    const sql = getSql();
    const rows = (await (sql as any).query(
      `SELECT a.id, a.slug, a.title, a.excerpt, a.content_html, a.featured_image_url, a.featured_image_alt, a.category, a.tags, a.published_at, a.views_count, u.name as author_name
       FROM articles a LEFT JOIN users u ON u.id = a.author_id
       WHERE a.slug = $1 AND a.status = 'published' LIMIT 1`,
      [slug]
    )) as any[];
    if (!rows[0]) return null;
    await (sql as any).query(`UPDATE articles SET views_count = views_count + 1 WHERE id = $1`, [rows[0].id]);
    return rows[0];
  } catch {
    return null;
  }
}

