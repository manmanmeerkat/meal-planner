// hooks/useRecipes.ts
import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
}

interface SupabaseError {
  message: string;
}

interface NewRecipe {
  title: string;
  description: string;
  image_url: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      }
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipe: NewRecipe) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select();

      if (error) throw error;
      setRecipes([...recipes, data[0]]);
      return data[0];
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    addRecipe,
    getRecipe,
  };
}