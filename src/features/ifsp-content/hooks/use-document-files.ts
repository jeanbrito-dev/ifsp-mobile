import { useMutation } from '@tanstack/react-query';

import {
  downloadRemoteFile,
  viewRemoteFile,
} from '../../../services/files/document-files';
import type { IfspDocument } from '../../../types/ifsp-content';

// Visualizar/baixar são efeitos locais (não alteram dados no servidor): não há query key para invalidar.
export function useViewDocument() {
  return useMutation({
    mutationFn: (document: IfspDocument) => viewRemoteFile(document.fileUrl),
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: (document: IfspDocument) =>
      downloadRemoteFile({
        title: document.title,
        url: document.fileUrl,
        mimeType: document.mimeType,
      }),
  });
}
