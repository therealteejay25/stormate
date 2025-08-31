'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/client"
import { fetchSettings, fetchStoresForUser, upsertSettings } from '@/lib/settings';
import { uploadLogo } from '@/lib/storage';
import type { StoreSettings, Store } from '@/types';

// shadcn components import style (adjust to your project)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { withAuth } from '@/hooks/useAuth';

const SettingsPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await fetchStoresForUser();
        setStores(s || []);
        if (s && s.length) {
          setStoreId(s[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      setLoading(true);
      try {
        const s = await fetchSettings(storeId);
        if (s) setSettings(s);
        else setSettings({ store_id: storeId, currency: 'USD', payment_methods: ['cash','card'], low_stock_threshold: 5, notifications: { sms: true, in_app:true }});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  async function handleSave() {
    if (!storeId) return;
    setSaving(true);
    try {
      let logoPath = settings.logo_path ?? null;
      if (logoFile) {
        const url = await uploadLogo(storeId, logoFile);
        logoPath = url;
      }
      const payload: Partial<StoreSettings> = {
        store_id: storeId,
        currency: settings.currency ?? 'USD',
        payment_methods: settings.payment_methods ?? ['cash','card'],
        low_stock_threshold: Number(settings.low_stock_threshold ?? 5),
        notifications: settings.notifications ?? { sms: true, in_app: true },
        logo_path: logoPath,
      };
      const saved = await upsertSettings(payload);
      setSettings(saved);
      // optional: show toast
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Store Settings</h1>

      <div>
        <Label>Choose Store</Label>
        <Select value={storeId ?? ''} onValueChange={(v) => setStoreId(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Store logo</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
          {settings.logo_path && <img src={settings.logo_path} alt="logo" className="h-20 mt-2 object-contain" />}
        </div>

        <div>
          <Label>Store currency</Label>
          <Input value={settings.currency ?? ''} onChange={(e) => setSettings({...settings, currency: e.target.value})} placeholder="USD" />
        </div>

        <div>
          <Label>Payment methods (comma separated)</Label>
          <Input value={(settings.payment_methods || []).join(',')} onChange={(e) => setSettings({...settings, payment_methods: e.target.value.split(',').map(s=>s.trim())})} />
        </div>

        <div>
          <Label>Low stock threshold</Label>
          <Input type="number" value={String(settings.low_stock_threshold ?? 5)} onChange={(e) => setSettings({...settings, low_stock_threshold: Number(e.target.value)})} />
        </div>

        <div className="flex items-center space-x-3">
          <Label>SMS notifications</Label>
          <Switch checked={settings.notifications?.sms ?? true} onCheckedChange={(v) => setSettings({...settings, notifications: {...settings.notifications, sms: Boolean(v)}})} />
        </div>

        <div className="flex items-center space-x-3">
          <Label>In-app notifications</Label>
          <Switch checked={settings.notifications?.in_app ?? true} onCheckedChange={(v) => setSettings({...settings, notifications: {...settings.notifications, in_app: Boolean(v)}})} />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </div>
    </div>
  );
}



export default withAuth(SettingsPage)