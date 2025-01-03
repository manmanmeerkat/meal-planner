import { useLocalSearchParams, router } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { RecipeForm } from "../../../components/recipe/RecipeForm";
import { useRecipes } from "../../../hooks/useRecipes";
import { useEffect, useState } from "react";
import { Recipe } from "../../../types/recipe";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default function EditRecipe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe, updateRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    if (typeof id === "string") {
      const data = await getRecipe(id);
      setRecipe(data);
    }
  };

  const handleSubmit = async (recipeData: Partial<Omit<Recipe, "id">>) => {
    if (typeof id === "string") {
      const result = await updateRecipe(id, recipeData);
      if (result) {
        router.push(`/recipes/${id}`);
      }
    }
  };

  if (!recipe) return null;

  return (
    <ThemedView style={styles.container}>
      <RecipeForm onSubmit={handleSubmit} initialData={recipe} />
    </ThemedView>
  );
}
