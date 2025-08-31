import { supabase } from './client';

export async function uploadLogo(storeId: string, file: File) {
  const ext = file.name.split('.').pop();
  const fileName = `stores/${storeId}/logo.${ext}`;
  const { data, error } = await supabase.storage
    .from('store-assets')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;
  // return public URL
  const { data: urlData } = supabase.storage.from('store-assets').getPublicUrl(fileName);
  return urlData.publicUrl;
}
