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

// hooks/useMealPlan.ts
export function useMealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
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
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addMealPlan = async (mealPlan: Omit<MealPlan, 'id'>) => {
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

      // 新しいデータを即座に状態に反映
      setMealPlans(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // hooks/useMealPlans.ts に deleteMealPlan を追加
const deleteMealPlan = async (id: string) => {
  try {
    setLoading(true);
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    // 削除後にステートを更新
    setMealPlans(prev => prev.filter(plan => plan.id !== id));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    setLoading(false);
  }
};

  // 初回マウント時にデータを取得
  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    fetchMealPlans(today, endDate);
  }, []);

  return {
    mealPlans,
    loading,
    error,
    fetchMealPlans,
    addMealPlan,
    deleteMealPlan,
  };
}