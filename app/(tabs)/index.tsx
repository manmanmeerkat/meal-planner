// app/(tabs)/index.tsx
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ThemedView } from "../../components/ui/ThemedView";
import { ThemedText } from "../../components/ui/ThemedText";
import { RecipeCard } from "../../components/recipe/RecipeCard";
import { useRecipes } from "../../hooks/useRecipes";
import { useMealPlans } from "../../hooks/useMealPlan";
import { MealType } from "../../types/mealPlans";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Recipe } from "../../types/recipe";

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

export default function HomeScreen() {
  const { recipes } = useRecipes();
  const { mealPlans, loading, fetchMealPlans, deleteMealPlan } = useMealPlans();
  const { refresh } = useLocalSearchParams();

  const mealTypes: { type: MealType; label: string; icon: any }[] = [
    { type: "breakfast", label: "朝食", icon: "sunny-outline" },
    { type: "lunch", label: "昼食", icon: "restaurant-outline" },
    { type: "dinner", label: "夕食", icon: "moon-outline" },
  ];

  const loadData = async () => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    await fetchMealPlans(today, endDate);
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  useEffect(() => {
    loadData();
  }, []);

  // 今日の献立を抽出（mealPlanIdを含める）
  const todaysMeals = mealPlans?.reduce((acc, meal) => {
    if (meal.date === format(new Date(), "yyyy-MM-dd")) {
      if (!acc[meal.meal_type]) {
        acc[meal.meal_type] = [];
      }
      acc[meal.meal_type].push({
        id: meal.id,
        recipe: meal.recipe!,
      });
    }
    return acc;
  }, {} as Record<MealType, Array<{ id: string; recipe: Recipe }>>);

  const handlePressEmptyMeal = (type: MealType) => {
    const today = format(new Date(), "yyyy-MM-dd");
    router.push({
      pathname: "/plans/create",
      params: {
        date: today,
        mealType: type,
        from: "home", // fromパラメータを追加
      },
    });
  };

  const handleDelete = async (mealPlanId: string) => {
    Alert.alert("メニューの削除", "このメニューを削除しますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          try {
            const success = await deleteMealPlan(mealPlanId);
            if (success) {
              await loadData(); // データを再読み込み
            } else {
              Alert.alert("エラー", "削除に失敗しました。");
            }
          } catch (error) {
            console.error("Failed to delete meal plan:", error);
            Alert.alert("エラー", "削除中にエラーが発生しました。");
          }
        },
      },
    ]);
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
          {mealTypes.map(({ type, label, icon }) => (
            <View key={type} style={styles.mealCard}>
              <View
                style={[
                  styles.mealHeader,
                  { backgroundColor: COLORS.mealTypes[type] },
                ]}
              >
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
                        <RecipeCard
                          recipe={meal.recipe}
                          compact
                          mealPlanId={meal.id}
                          onDelete={() => handleDelete(meal.id)}
                        />
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
                        color="#718096"
                      />
                      <ThemedText style={styles.emptyText}>
                        タップしてメニューを設定
                      </ThemedText>
                    </View>
                  </Pressable>
                )}
              </View>
            </View>
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
    backgroundColor: "#FF6B6B", // より温かみのある赤系の色に変更
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
    padding: 16,
    paddingBottom: 4,
    textAlign: "center", // 中央揃えに変更
  },
  dateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
    textAlign: "center", // 中央揃えに変更
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    color: "#718096",
    fontSize: 14,
    marginTop: 8,
  },
  recipesSection: {
    padding: 16,
    backgroundColor: COLORS.card,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAll: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  recipeCard: {
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingBottom: 16,
  },
});
