// Arquivos (fotos, PDFs) vêm do backend como caminho relativo (ex.: "uploads/documentos/x.pdf").
// Por padrão usamos a origem da API sem o sufixo "/api". Se os arquivos ficam em outro host
// (S3, CDN...), defina EXPO_PUBLIC_FILES_URL no .env.
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
const filesBase = (
  process.env.EXPO_PUBLIC_FILES_URL ?? apiUrl.replace(/\/api\/?$/, '')
).replace(/\/+$/, '');

export function resolveAssetUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  // Normaliza "\" (caminhos gerados no Windows) e barras iniciais.
  const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${filesBase}/${clean}`;
}