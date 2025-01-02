// hooks/useMealPlan.ts
import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';

export function useMealPlan() {
  const [mealPlans, setMealPlans] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchMealPlans = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          recipe:recipes(*)
        `)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) throw error;

      // 日付ごとにグループ化
      const groupedPlans = data.reduce((acc, plan) => {
        const date = plan.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(plan);
        return acc;
      }, {});

      setMealPlans(groupedPlans);
    } finally {
      setLoading(false);
    }
  };

  return {
    mealPlans,
    loading,
    fetchMealPlans,
  };
}