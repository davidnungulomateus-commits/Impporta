import { supabase } from './supabase';

const BUCKET = 'cleaning-media';

export async function uploadCleaningMedia(file: File, folder: string) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data: signed, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);
  if (signedError) throw signedError;
  return { path, url: signed.signedUrl };
}

export async function createCleaningMediaUrl(path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
