export type Locale = "th" | "en" | "zh";

export type ContentStatus = "reference_only" | "draft" | "verified" | "licensed" | "published";

export type Profile = {
  id: string;
  display_name: string | null;
  preferred_language: Locale;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name_th: string;
  name_en: string;
  name_zh: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Temple = {
  id: string;
  slug: string;
  name_th: string;
  name_en: string;
  name_zh: string | null;
  sacred_name_th: string | null;
  sacred_name_en: string | null;
  sacred_name_zh: string | null;
  description_th: string | null;
  description_en: string | null;
  description_zh: string | null;
  province_th: string | null;
  province_en: string | null;
  location_text: string | null;
  hero_image_url: string | null;
  thumbnail_image_url: string | null;
  source_url: string | null;
  source_name: string | null;
  source_reference: string | null;
  fortune_source_status: string;
  content_status: ContentStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FortuneSet = {
  id: string;
  temple_id: string;
  name: string;
  version: string;
  total_fortunes: number;
  source_url: string | null;
  source_name: string | null;
  source_note: string | null;
  content_status: ContentStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Fortune = {
  id: string;
  fortune_set_id: string;
  number: number;
  original_text_th: string;
  interpretation_th: string | null;
  original_text_en: string | null;
  interpretation_en: string | null;
  original_text_zh: string | null;
  interpretation_zh: string | null;
  source_url: string | null;
  source_reference: string | null;
  content_status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type FortuneHistory = {
  id: string;
  user_id: string;
  temple_id: string;
  fortune_set_id: string;
  fortune_id: string;
  fortune_number: number;
  language: Locale;
  created_at: string;
};

export type NFCCard = {
  id: string;
  token: string;
  zodiac: string | null;
  edition: string | null;
  temple_id: string | null;
  owner_id: string | null;
  is_active: boolean;
  activated_at: string | null;
  created_at: string;
  updated_at: string;
};
