// hooks/useMealPlans.ts
import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';
import { MealPlan, MealType } from '../types/mealPlans';
import { format } from 'date-fns';

export function useMealPlans() {
 const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [todaysMeals, setTodaysMeals] = useState<Record<MealType, MealPlan | undefined>>({
   breakfast: undefined,
   lunch: undefined,
   dinner: undefined,
 });

 const fetchTodaysMeals = async () => {
   try {
     setLoading(true);
     const today = format(new Date(), 'yyyy-MM-dd');
     
     const { data, error } = await supabase
       .from('meal_plans')
       .select(`
         *,
         recipe:recipes(*)
       `)
       .eq('date', today);

     if (error) throw error;

     const meals = data.reduce((acc, meal) => {
       acc[meal.meal_type] = meal;
       return acc;
     }, {} as Record<MealType, MealPlan>);

     setTodaysMeals(meals);
     return meals;
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

 useEffect(() => {
   fetchTodaysMeals();
 }, []);

 const fetchMealPlans = async (startDate: Date, endDate: Date) => {
   try {
     setLoading(true);
     const { data, error } = await supabase
       .from('meal_plans')
       .select('*, recipe:recipes(*)')
       .gte('date', startDate.toISOString().split('T')[0])
       .lte('date', endDate.toISOString().split('T')[0])
       .order('date');

     if (error) throw error;
     setMealPlans(data || []);
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

 const addMealPlan = async (mealPlan: Omit<MealPlan, 'id' | 'created_at'>) => {
   try {
     setLoading(true);
     const { data, error } = await supabase
       .from('meal_plans')
       .insert([mealPlan])
       .select(`
         *,
         recipe:recipes(*)
       `)
       .single();

     if (error) throw error;
     await fetchTodaysMeals(); // 今日の献立を再取得
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

 const updateMealPlan = async (id: string, updates: Partial<MealPlan>) => {
   try {
     setLoading(true);
     const { data, error } = await supabase
       .from('meal_plans')
       .update(updates)
       .eq('id', id)
       .select()
       .single();

     if (error) throw error;
     await fetchTodaysMeals(); // 今日の献立を再取得
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

 const deleteMealPlan = async (id: string) => {
   try {
     setLoading(true);
     const { error } = await supabase
       .from('meal_plans')
       .delete()
       .eq('id', id);

     if (error) throw error;
     await fetchTodaysMeals(); // 今日の献立を再取得
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
   mealPlans,
   todaysMeals,
   loading,
   error,
   fetchMealPlans,
   fetchTodaysMeals,
   addMealPlan,
   updateMealPlan,
   deleteMealPlan,
 };
}