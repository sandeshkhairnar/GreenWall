import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

/* =====================
   AUTH
===================== */

// User.ts

export const signUp = async (email: string, password: string, full_name?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};


export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

/* =====================
   PROFILE
===================== */

export const getProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (updates: {
  full_name?: string;
  username?: string;
  website?: string;
  avatar_url?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
};

/* =====================
   AVATAR UPLOAD
===================== */

export const uploadAvatar = async (file: File) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  // Upload file to private bucket
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Create a signed URL (valid for e.g., 1 hour = 3600 seconds)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('avatars')
    .createSignedUrl(filePath, 3600); // expires in 3600 seconds

  if (signedUrlError) throw signedUrlError;

  // Save signed URL in profile (optional, usually you store the file path)
  await updateProfile({ avatar_url: signedUrlData.signedUrl });

  return signedUrlData.signedUrl;
};

