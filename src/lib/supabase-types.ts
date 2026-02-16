export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_progress: {
        Row: {
          id: string;
          user_id: string;
          book: string;
          chapter: number;
          section: string | null;
          status: "not_started" | "in_progress" | "completed";
          completion_percentage: number;
          last_studied_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book: string;
          chapter: number;
          section?: string | null;
          status?: "not_started" | "in_progress" | "completed";
          completion_percentage?: number;
          last_studied_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book?: string;
          chapter?: number;
          section?: string | null;
          status?: "not_started" | "in_progress" | "completed";
          completion_percentage?: number;
          last_studied_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          book: string;
          chapter: number;
          section: string | null;
          content: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book: string;
          chapter: number;
          section?: string | null;
          content: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book?: string;
          chapter?: number;
          section?: string | null;
          content?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          book: string;
          chapter: number | null;
          score: number;
          total_questions: number;
          answers: Json;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book: string;
          chapter?: number | null;
          score: number;
          total_questions: number;
          answers: Json;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book?: string;
          chapter?: number | null;
          score?: number;
          total_questions?: number;
          answers?: Json;
          completed_at?: string;
        };
        Relationships: [];
      };
      highlights: {
        Row: {
          id: string;
          user_id: string;
          book: string;
          chapter: number;
          highlighted_text: string;
          note: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book: string;
          chapter: number;
          highlighted_text: string;
          note?: string | null;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book?: string;
          chapter?: number;
          highlighted_text?: string;
          note?: string | null;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      cross_references: {
        Row: {
          id: string;
          user_id: string;
          source_book: string;
          source_chapter: number;
          target_book: string;
          target_chapter: number;
          connection_note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_book: string;
          source_chapter: number;
          target_book: string;
          target_chapter: number;
          connection_note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_book?: string;
          source_chapter?: number;
          target_book?: string;
          target_chapter?: number;
          connection_note?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      flashcard_progress: {
        Row: {
          id: string;
          user_id: string;
          flashcard_id: string;
          easiness_factor: number;
          interval_days: number;
          repetitions: number;
          next_review: string;
          last_quality: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          flashcard_id: string;
          easiness_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review?: string;
          last_quality?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          flashcard_id?: string;
          easiness_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review?: string;
          last_quality?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tutor_conversations: {
        Row: {
          id: string;
          user_id: string;
          difficulty: string;
          topic: string | null;
          messages: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          difficulty?: string;
          topic?: string | null;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          difficulty?: string;
          topic?: string | null;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
