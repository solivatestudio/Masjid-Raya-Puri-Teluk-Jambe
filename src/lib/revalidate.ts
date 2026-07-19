export async function revalidateCMS(extraPaths: string[] = []): Promise<void> {
  try {
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        paths: ['/', '/blog', ...extraPaths],
        tags: ['articles', 'kajian', 'khutbah', 'public-data'],
      }),
    });
  } catch (e) {
    // silent — main action already saved
  }
}