import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { getCmsSession } from '@/lib/auth-admin';

const f = createUploadthing();

export const uploadRouter = {
  // Featured image untuk artikel blog (1 file, max 4MB)
  featuredImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getCmsSession();
      if (!session) throw new UploadThingError('Unauthorized: login terlebih dahulu');
      return { userId: session.userId, role: session.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
        size: file.size,
        uploadedBy: metadata.userId,
      };
    }),

  // Gallery image untuk galeri masjid (multiple, max 8 files)
  galleryImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 8,
    },
  })
    .middleware(async () => {
      const session = await getCmsSession();
      if (!session) throw new UploadThingError('Unauthorized: login terlebih dahulu');
      return { userId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, key: file.key, name: file.name };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
