// lib/settings.ts
import { supabase } from './client';
import type { StoreSettings } from './types';

export async function fetchStoresForUser() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];
  // fetch stores where user is a member or owner
  const { data, error } = await supabase
    .from('stores')
    .select('id,name')
    .or(`owner_user_id.eq.${user.id},id.in.(select store_id from store_members where user_id.eq.${user.id}))`);
  if (error) throw error;
  return data;
}

export async function fetchSettings(storeId: string): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('store_id', storeId)
    .single();
  if (error && error.code === 'PGRST116') return null;
  if (error) throw error;
  return data as StoreSettings;
}

export async function upsertSettings(payload: Partial<StoreSettings>) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('store_settings')
    .upsert({ ...payload, updated_at: now }, { onConflict: 'store_id' })
    .select()
    .single();
  if (error) throw error;
  return data as StoreSettings;
}
