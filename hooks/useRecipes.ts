// hooks/useRecipes.ts
import { useState } from 'react';
import { supabase } from '../constants/supabase';
import { Recipe } from '../types/recipe';

export function useRecipes() {
 const [recipes, setRecipes] = useState<Recipe[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const fetchRecipes = async (forceRefresh = true) => {
   try {
     setLoading(true);
     const { data, error } = await supabase
       .from('recipes')
       .select('*')
       .order('created_at', { ascending: false });

     if (error) throw error;
     setRecipes(data || []);
     return data;
   } catch (err) {
     console.error('Error fetching recipes:', err);
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
     setLoading(true);
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
   } finally {
     setLoading(false);
   }
 };

 const createRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at'>) => {
   try {
     setLoading(true);
     const { data, error } = await supabase
       .from('recipes')
       .insert([recipe])
       .select()
       .single();

     if (error) throw error;
     setRecipes(prev => [data, ...prev]);
     return data;
   } catch (err) {
     console.error('Error creating recipe:', err);
     return null;
   } finally {
     setLoading(false);
   }
 };

 const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
   try {
     setLoading(true);
     const { data, error } = await supabase
       .from('recipes')
       .update(updates)
       .eq('id', id)
       .select()
       .single();

     if (error) throw error;

     setRecipes(prev =>
       prev.map(recipe => (recipe.id === id ? data : recipe))
     );

     return data;
   } catch (err) {
     console.error('Error updating recipe:', err);
     return null;
   } finally {
     setLoading(false);
   }
 };

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
     console.error('Error deleting recipe:', err);
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