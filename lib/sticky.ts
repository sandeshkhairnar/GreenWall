import { createClient } from '@/utils/supabase/client';

import CryptoJS from 'crypto-js';
const supabase = createClient();

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-change-this';

/* =====================
   ENCRYPTION/DECRYPTION
===================== */

export const encryptText = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decryptText = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/* =====================
   TYPES
===================== */

export interface Note {
  id: string;
  user_id: string;
  date: string;
  text: string;
  mood: string;
  emoji: string;
  created_at: string;
  updated_at: string;
}

export interface NoteInput {
  text: string;
  mood: string;
  emoji: string;
  date?: string;
}

/* =====================
   NOTES CRUD
===================== */

export const createNote = async (noteInput: NoteInput): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const encryptedText = encryptText(noteInput.text);

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      text: encryptedText,
      mood: noteInput.mood,
      emoji: noteInput.emoji,
      date: noteInput.date || new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    text: decryptText(data.text),
  };
};

export const getNotes = async (): Promise<Note[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(note => ({
    ...note,
    text: decryptText(note.text),
  }));
};

export const getNote = async (id: string): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;

  return {
    ...data,
    text: decryptText(data.text),
  };
};

export const updateNote = async (id: string, updates: Partial<NoteInput>): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.text) {
    updateData.text = encryptText(updates.text);
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    text: decryptText(data.text),
  };
};

export const deleteNote = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const getNotesByDateRange = async (startDate: string, endDate: string): Promise<Note[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(note => ({
    ...note,
    text: decryptText(note.text),
  }));
};

export const getNotesCount = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { count, error } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) throw error;
  return count || 0;
};