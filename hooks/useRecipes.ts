// hooks/useRecipes.ts
import { useState } from 'react';
import { supabase } from '../constants/supabase';
import { Recipe } from '../types/recipe';

const DEFAULT_IMAGE_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/recipe-images/default-recipe-image.png`;

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async (forceRefresh = false) => {
    if (!supabase) return null;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching recipes:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecipe = async (id: string) => {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error getting recipe:', err);
      return null;
    }
  };

  const createRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const recipeWithImage = {
        ...recipe,
        image_url: recipe.image_url || DEFAULT_IMAGE_URL,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('recipes')
        .insert([recipeWithImage])
        .select()
        .single();

      if (error) {
        // 一意性制約違反のエラーを確認
        if (error.code === '23505') {
          throw new Error(`「${recipe.title}」は既に登録されているレシピ名です。\n別のレシピ名を入力してください。`);
        }
        throw error;
      }

      setRecipes(prev => [data, ...prev]);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      console.error('Error creating recipe:', err);
      throw new Error('レシピの保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    if (!supabase) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // 一意性制約違反のエラーを確認
        if (error.code === '23505') {
          throw new Error(`「${updates.title}」は既に登録されているレシピ名です。\n別のレシピ名を入力してください。`);
        }
        throw error;
      }
      
      setRecipes(prev => prev.map(recipe => recipe.id === id ? data : recipe));
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      console.error('Error updating recipe:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!supabase) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting recipe:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    recipes,
    loading,
    fetchRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}