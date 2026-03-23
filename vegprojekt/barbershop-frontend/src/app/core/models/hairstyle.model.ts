export interface Hairstyle {
  id: number;
  name: string;
  description: string | null;
  price_from: number | null;
  created_at?: string;
  updated_at?: string;
}
