// hooks/useSupabase.ts
import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let supabaseInstance: SupabaseClient | null = null;

const getStorage = () => {
  console.log('Getting storage for platform:', Platform.OS);
  console.log('Using AsyncStorage');
  return AsyncStorage;
};

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSupabase() {
      try {
        if (supabaseInstance) {
          setSupabase(supabaseInstance);
          setLoading(false);
          return;
        }

       
        const storage = getStorage();
        const client = createClient(
          process.env.EXPO_PUBLIC_SUPABASE_URL!,
          process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              storage,
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: false,
            },
          }
        );

        const { data, error } = await client.auth.getSession();
        console.log('Supabase connection test:', { 
          success: !error, 
          hasSession: !!data.session 
        });

        supabaseInstance = client;
        setSupabase(client);
        console.log('Supabase initialized successfully');
      } catch (error) {
        console.error('Supabase initialization error:', error);
      } finally {
        setLoading(false);
      }
    }

    initSupabase();
  }, []);

  return { supabase, loading };
}