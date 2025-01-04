// app/(tabs)/index.tsx
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ThemedView } from "../../components/ui/ThemedView";
import { ThemedText } from "../../components/ui/ThemedText";
import { RecipeCard } from "../../components/recipe/RecipeCard";
import { useRecipes } from "../../hooks/useRecipes";
import { useMealPlans } from "../../hooks/useMealPlan";
import { MealType } from "../../types/mealPlans";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../../types/recipe";

// 新しいカラーパレット
const COLORS = {
  primary: "#FF6B6B", // ポップな赤
  secondary: "#4ECDC4", // ミントグリーン
  accent: "#FFE66D", // 明るい黄色
  background: "#F7F9FC", // 明るい背景色
  card: "#FFFFFF", // 白
  text: {
    primary: "#2D3748", // 濃い色のテキスト
    secondary: "#718096", // 薄い色のテキスト
    accent: "#FF6B6B", // アクセントテキスト
  },
};

export default function HomeScreen() {
  const { recipes } = useRecipes();
  const { mealPlans, loading } = useMealPlans();

  const mealTypes: {
    type: MealType;
    label: string;
    icon: any;
    color: string;
  }[] = [
    {
      type: "breakfast",
      label: "朝食",
      icon: "sunny-outline",
      color: "#FFB347",
    }, // オレンジ
    {
      type: "lunch",
      label: "昼食",
      icon: "restaurant-outline",
      color: "#4ECDC4",
    }, // ミント
    { type: "dinner", label: "夕食", icon: "moon-outline", color: "#A78BFA" }, // パープル
  ];

  const todaysMeals = mealPlans?.reduce((acc, meal) => {
    if (meal.date === format(new Date(), "yyyy-MM-dd")) {
      if (!acc[meal.meal_type]) {
        acc[meal.meal_type] = [];
      }
      acc[meal.meal_type].push({ recipe: meal.recipe! });
    }
    return acc;
  }, {} as Record<MealType, Array<{ recipe: Recipe }>>);

  const handlePressEmptyMeal = (type: MealType) => {
    const today = format(new Date(), "yyyy-MM-dd");
    router.push({
      pathname: "/plans/create",
      params: {
        date: today,
        mealType: type,
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeText}>今日の献立</ThemedText>
          <ThemedText style={styles.dateText}>
            {format(new Date(), "yyyy年M月d日(E)", { locale: ja })}
          </ThemedText>
        </View>

        <View style={styles.mealsSection}>
          {mealTypes.map(({ type, label, icon, color }) => (
            <View key={type} style={styles.mealCard}>
              <View style={[styles.mealHeader, { backgroundColor: color }]}>
                <Ionicons name={icon} size={24} color="white" />
                <ThemedText style={styles.mealLabel}>{label}</ThemedText>
                <Pressable
                  onPress={() => handlePressEmptyMeal(type)}
                  style={({ pressed }) => [
                    styles.addButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="add-circle" size={24} color="white" />
                </Pressable>
              </View>
              <View style={styles.mealContent}>
                {todaysMeals?.[type]?.length > 0 ? (
                  <View style={styles.recipeList}>
                    {todaysMeals[type].map((meal, index) => (
                      <View key={index} style={styles.recipeItem}>
                        <RecipeCard recipe={meal.recipe} compact />
                      </View>
                    ))}
                  </View>
                ) : (
                  <Pressable
                    onPress={() => handlePressEmptyMeal(type)}
                    style={({ pressed }) => [
                      styles.emptyMeal,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.emptyContent}>
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color={color}
                      />
                      <ThemedText style={[styles.emptyText, { color }]}>
                        タップしてメニューを設定
                      </ThemedText>
                    </View>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.recipesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              最近追加したレシピ
            </ThemedText>
            <Pressable
              onPress={() => router.push("/recipes")}
              style={({ pressed }) => [
                styles.seeAllButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.seeAll}>すべて見る</ThemedText>
            </Pressable>
          </View>
          {recipes?.slice(0, 3).map((recipe) => (
            <Pressable
              key={recipe.id}
              style={({ pressed }) => [
                styles.recipeCard,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push(`/recipes/${recipe.id}`)}
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
  welcomeSection: {
    padding: 20,
    paddingTop: 24,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  mealsSection: {
    padding: 16,
    gap: 16,
  },
  mealCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  mealLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    flex: 1,
    marginLeft: 8,
  },
  addButton: {
    padding: 4,
  },
  mealContent: {
    padding: 16,
  },
  recipeList: {
    gap: 12,
  },
  recipeItem: {
    marginBottom: 8,
  },
  emptyMeal: {
    padding: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E2E8F0",
  },
  emptyContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  recipesSection: {
    padding: 16,
    backgroundColor: COLORS.card,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  seeAllButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAll: {
    color: "white",
    fontSize: 14,
  },
  recipeCard: {
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
