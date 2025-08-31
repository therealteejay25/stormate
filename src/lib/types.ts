export type Store = {
    id: string;
    owner_user_id: string;
    name: string;
  };
  
  export type StoreSettings = {
    id: string;
    store_id: string;
    currency: string;
    payment_methods: string[];
    low_stock_threshold: number;
    notifications: { sms: boolean; in_app: boolean };
    logo_path?: string | null;
    extras?: Record<string, any>;
    updated_at?: string;
  };
  