import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';

import { buildFileName } from '../../utils/build-file-name';

type RemoteFile = { title: string; url: string; mimeType?: string | null };

/** Visualização: navegador in-app (nova aba na web). */
export async function viewRemoteFile(url: string): Promise<void> {
  await WebBrowser.openBrowserAsync(url);
}

/** Download para o cache e abertura da folha do sistema (Salvar em Arquivos, Drive etc.). */
export async function downloadRemoteFile({ title, url, mimeType }: RemoteFile) {
  if (Platform.OS === 'web') {
    await Linking.openURL(url);
    return { uri: url, shared: false };
  }

  const directory = new Directory(Paths.cache, 'documents');
  directory.create({ idempotent: true, intermediates: true });

  const destination = new File(directory, buildFileName(title, url, mimeType));
  const file = await File.downloadFileAsync(url, destination, { idempotent: true });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: mimeType ?? undefined,
      dialogTitle: title,
    });
  }
  return { uri: file.uri, shared: canShare };
}
