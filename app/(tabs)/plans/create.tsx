// app/(tabs)/plans/create.tsx
import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { RecipeCard } from "../../../components/recipe/RecipeCard";
import { useMealPlans } from "../../../hooks/useMealPlan";
import { useRecipes } from "../../../hooks/useRecipes";
import { Ionicons } from "@expo/vector-icons";
import { MealType } from "../../../types/mealPlans";

const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  background: "#F7F9FC",
  card: "#FFFFFF",
  text: {
    primary: "#2D3748",
    secondary: "#718096",
    accent: "#FF6B6B",
  },
  mealTypes: {
    breakfast: "#FFB347",
    lunch: "#4ECDC4",
    dinner: "#A78BFA",
  },
};

export default function CreatePlan() {
  const params = useLocalSearchParams();
  const { addMealPlan } = useMealPlans();
  const { recipes, fetchRecipes, loading } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSelectRecipe = async (recipeId: string) => {
    if (!params.date || !params.mealType) return;

    const result = await addMealPlan({
      date: params.date as string,
      meal_type: params.mealType as MealType,
      recipe_id: recipeId,
    });

    if (result) {
      router.back();
    }
  };

  const getMealTypeColor = (mealType: string) => {
    return (
      COLORS.mealTypes[mealType as keyof typeof COLORS.mealTypes] ||
      COLORS.primary
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: getMealTypeColor(params.mealType as string) },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <ThemedText style={styles.title}>レシピを選択</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.recipeList}>
          {recipes?.map((recipe) => (
            <Pressable
              key={recipe.id}
              onPress={() => handleSelectRecipe(recipe.id)}
              style={({ pressed }) => [
                styles.recipeCard,
                pressed && styles.pressed,
              ]}
            >
              <RecipeCard recipe={recipe} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
  },
  recipeList: {
    padding: 16,
    gap: 16,
  },
  recipeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
});
