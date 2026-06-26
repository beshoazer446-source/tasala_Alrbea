import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnon;

export const supabase      = createClient(supabaseUrl, supabaseAnon);
export const supabaseAdmin = createClient(supabaseUrl, supabaseService);

export interface DBProduct {
  id: number;
  category_id: string;
  name_ar: string;
  name_en: string;
  price_per_kg: number;
  price_125g?: number;
  price_250g?: number;
  price_500g?: number;
  price_750g?: number;
  price_1kg?: number;
  image: string;
  unit_price?: number;
  sold_by_unit: boolean;
  in_stock: boolean;
  badge?: 'new' | 'sale' | 'hot';
  discount?: number;
  flavors?: string[];
  description?: string;
  sort_order: number;
}

export interface DBCategory {
  id: string;
  name_ar: string;
  name_en: string;
  image: string;
  color: string;
  gradient: string;
  sort_order: number;
}
