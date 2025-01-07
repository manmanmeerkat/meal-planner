// hooks/useSupabaseStorage.ts
import { supabase } from '../constants/supabase';
import * as FileSystem from 'expo-file-system';

export const useSupabaseStorage = () => {
  const uploadRecipeImage = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `recipe-${Date.now()}.${ext}`;
      const filePath = `recipes/${fileName}`;

      // FormDataの作成
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: fileName,
        type: `image/${ext}`,
      } as any);

      // Supabase Storage APIを直接呼び出し
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/recipe-images/${filePath}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      return publicUrl;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return { uploadRecipeImage };
};