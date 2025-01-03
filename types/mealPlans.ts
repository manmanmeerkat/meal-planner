// types/mealPlan.ts
import { Recipe } from './recipe';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealPlan {
  id: string;
  date: string;
  meal_type: MealType;
  recipe_id: string;
  recipe?: Recipe;
  created_at?: string;
}

export type DailyMeals = Record<MealType, { recipe: Recipe } | undefined>;