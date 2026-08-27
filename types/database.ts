import type { Category, Fortune, FortuneHistory, FortuneSet, NFCCard, Profile, Temple } from "./domain";

type Table<Row, Generated extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, "created_at" | "updated_at">;
      categories: Table<Category, "id" | "created_at" | "updated_at">;
      temples: Table<Temple, "id" | "created_at" | "updated_at">;
      temple_categories: {
        Row: { temple_id: string; category_id: string; created_at: string };
        Insert: { temple_id: string; category_id: string; created_at?: string };
        Update: { temple_id?: string; category_id?: string; created_at?: string };
        Relationships: [];
      };
      fortune_sets: Table<FortuneSet, "id" | "created_at" | "updated_at">;
      fortunes: Table<Fortune, "id" | "created_at" | "updated_at">;
      fortune_history: Table<FortuneHistory, "id" | "created_at">;
      nfc_cards: Table<NFCCard, "id" | "created_at" | "updated_at">;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
