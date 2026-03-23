export interface Barber {
  id: number;
  user_id: number | null;
  name: string;
  specialization: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}
