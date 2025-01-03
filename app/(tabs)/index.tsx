// app/(tabs)/index.tsx
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "../../components/ui/ThemedView";
import { ThemedText } from "../../components/ui/ThemedText";
import { RecipeCard } from "../../components/recipe/RecipeCard";
import { useRecipes } from "../../hooks/useRecipes";
import { useMealPlans } from "../../hooks/useMealPlan";
import { MealType } from "../../types/mealPlans";

export default function HomeScreen() {
  const { recipes } = useRecipes();
  const { todaysMeals, loading } = useMealPlans();

  const mealTypes: { type: MealType; label: string }[] = [
    { type: "breakfast", label: "朝食" },
    { type: "lunch", label: "昼食" },
    { type: "dinner", label: "夕食" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* 今日の献立セクション */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>今日の献立</ThemedText>
          {mealTypes.map(({ type, label }) => (
            <View key={type} style={styles.mealContainer}>
              <ThemedText style={styles.mealLabel}>{label}</ThemedText>
              {todaysMeals[type]?.recipe ? (
                <RecipeCard recipe={todaysMeals[type]!.recipe} compact />
              ) : (
                <View style={styles.emptyMeal}>
                  <ThemedText style={styles.emptyText}>
                    メニューが未設定です
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 最近追加したレシピ */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            最近追加したレシピ
          </ThemedText>
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  mealContainer: {
    marginBottom: 12,
  },
  mealLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
  },
  emptyMeal: {
    padding: 16,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    color: "#718096",
    fontSize: 14,
  },
});
