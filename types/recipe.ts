export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
  cooking_time: number;
  calories: number;
  servings: number;
} 