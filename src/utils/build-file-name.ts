export function buildFileName(
  title: string,
  url: string,
  mimeType?: string | null,
): string {
  const cleanTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_');

  const extensionFromUrl = url.split('?')[0].split('.').pop();

  const extensionFromMime = mimeType?.split('/')[1];

  const extension = extensionFromMime || extensionFromUrl || 'pdf';

  return `${cleanTitle}.${extension}`;
}