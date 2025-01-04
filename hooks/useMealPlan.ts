// hooks/useMealPlans.ts
import { useState, useEffect } from 'react';
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
}

export function useMealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [todaysMeals, setTodaysMeals] = useState<Record<MealType, { recipe: Recipe } | undefined>>({
    breakfast: undefined,
    lunch: undefined,
    dinner: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMealPlans = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          recipe:recipes(*)
        `)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
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

      // 新しいデータを既存のmealPlansに追加
      setMealPlans(prev => [data, ...prev]);

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    fetchMealPlans(today, nextWeek);
  }, []);

  return {
    mealPlans,
    todaysMeals,
    loading,
    error,
    fetchMealPlans,
    addMealPlan,
  };
}