// app/(tabs)/recipes/create.tsx
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { RecipeForm } from "../../../components/recipe/RecipeForm";
import { useRecipes } from "../../../hooks/useRecipes";

export default function CreateRecipe() {
  const { createRecipe } = useRecipes();

  const handleSubmit = async (data: any) => {
    const result = await createRecipe(data);
    if (result) {
      router.back();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <RecipeForm onSubmit={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
