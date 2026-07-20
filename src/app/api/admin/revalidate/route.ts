import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await requireCmsAuth();
    const { paths, tags } = await req.json();

    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    if (Array.isArray(paths)) {
      for (const p of paths) {
        try {
          revalidatePath(p, 'page');
          revalidatedPaths.push(p);
        } catch {}
      }
    }

    if (Array.isArray(tags)) {
      for (const t of tags) {
        try {
          revalidateTag(t, 'default');
          revalidatedTags.push(t);
        } catch {}
      }
    }

    // Always also revalidate common pages
    revalidatePath('/', 'page');
    revalidatePath('/blog', 'page');
    revalidatePath('/blog', 'page');
    revalidatedPaths.push('/', '/blog');

    return NextResponse.json({
      message: 'Revalidated',
      paths: revalidatedPaths,
      tags: revalidatedTags,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

