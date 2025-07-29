import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lbehbtrbaamfjozwfizy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZWhidHJiYWFtZmpvendmaXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzcxMzMsImV4cCI6MjA2OTM1MzEzM30.enjLqzvhZoondvjT-IxuTvZ9adzW4WosaSugIspY05U';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket name
export const AUDIO_BUCKET = 'ca1-audio-files';

// Helper function to get public URL for audio file
export const getAudioUrl = (filePath: string) => {
  const { data } = supabase.storage
    .from(AUDIO_BUCKET)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

// Helper function to list files in a directory
export const listAudioFiles = async (directory: string = '') => {
  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .list(directory, {
      limit: 100,
      offset: 0
    });
  
  return { data, error };
};

// Helper function to upload a file
export const uploadAudioFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  return { data, error };
};

// Authentication functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

// Auth state change listener
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};