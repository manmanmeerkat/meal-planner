// hooks/useRecipes.ts
import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';
import { Recipe } from '../types/recipe';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // レシピ一覧取得
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // 単一レシピ取得
  const getRecipe = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // レシピ作成
  const createRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select();

      if (error) throw error;
      setRecipes(prev => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // レシピ更新
  const updateRecipe = async (id: string, updates: Partial<Omit<Recipe, 'id'>>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? data[0] : recipe
      ));
      return data[0];
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // レシピ削除
  const deleteRecipe = async (id: string) => {
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}