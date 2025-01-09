// hooks/useMealPlan.ts
import { useState } from 'react';
import { supabase } from '../constants/supabase';
import { format } from 'date-fns';
import { MealType } from '../types/mealPlans';
import { Recipe } from '../types/recipe';

export interface MealPlan {
 id: string;
 date: string;
 meal_type: MealType;
 recipe_id: string;
 recipe?: Recipe;
 created_at?: string;
 user_id: string;
}

export function useMealPlans() {
 const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const fetchMealPlans = async (startDate: Date, endDate: Date) => {
   try {
     setLoading(true);
     
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('Not authenticated');

     const { data, error } = await supabase
       .from('meal_plans')
       .select(`
         *,
         recipe:recipes(*)
       `)
       .eq('user_id', user.id)
       .gte('date', format(startDate, 'yyyy-MM-dd'))
       .lte('date', format(endDate, 'yyyy-MM-dd'))
       .order('created_at', { ascending: false });

     if (error) throw error;
     setMealPlans(data || []);
     return data;
   } catch (err) {
     console.error('Error fetching meal plans:', err);
     return null;
   } finally {
     setLoading(false);
   }
 };

 const addMealPlan = async (mealPlan: Omit<MealPlan, 'id' | 'created_at' | 'user_id'>) => {
   try {
     setLoading(true);
     
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('Not authenticated');

     const { data, error } = await supabase
       .from('meal_plans')
       .insert([{ ...mealPlan, user_id: user.id }])
       .select(`
         *,
         recipe:recipes(*)
       `)
       .single();

     if (error) throw error;
     setMealPlans(prev => [data, ...prev]);
     return data;
   } catch (err) {
     console.error('Error adding meal plan:', err);
     return null;
   } finally {
     setLoading(false);
   }
 };

 const updateMealPlan = async (id: string, updates: Partial<MealPlan>) => {
   try {
     setLoading(true);
     
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('Not authenticated');

     const { data, error } = await supabase
       .from('meal_plans')
       .update(updates)
       .eq('id', id)
       .eq('user_id', user.id)
       .select(`
         *,
         recipe:recipes(*)
       `)
       .single();

     if (error) throw error;
     setMealPlans(prev => 
       prev.map(plan => plan.id === id ? data : plan)
     );
     return data;
   } catch (err) {
     console.error('Error updating meal plan:', err);
     return null;
   } finally {
     setLoading(false);
   }
 };

 const deleteMealPlan = async (id: string) => {
   try {
     setLoading(true);
     
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('Not authenticated');

     const { error } = await supabase
       .from('meal_plans')
       .delete()
       .eq('id', id)
       .eq('user_id', user.id);

     if (error) throw error;
     setMealPlans(prev => prev.filter(plan => plan.id !== id));
     return true;
   } catch (err) {
     console.error('Error deleting meal plan:', err);
     return false;
   } finally {
     setLoading(false);
   }
 };

 return {
   mealPlans,
   loading,
   error,
   fetchMealPlans,
   addMealPlan,
   updateMealPlan,
   deleteMealPlan,
 };
}