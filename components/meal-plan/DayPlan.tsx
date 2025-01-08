// components/meal-plan/DayPlan.tsx
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
  Alert,
} from "react-native";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { router } from "expo-router";
import { ThemedView } from "../ui/ThemedView";
import { ThemedText } from "../ui/ThemedText";
import { RecipeCard } from "../recipe/RecipeCard";
import { Recipe } from "../../types/recipe";
import { MealType } from "../../types/mealPlans";
import { useMealPlans } from "../../hooks/useMealPlan";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

interface DailyMeals {
  [key: string]: Array<{
    id: string;
    recipe: Recipe;
  }>;
}

interface DayPlanProps {
  date: Date;
  meals: DailyMeals;
  onUpdate?: () => void;
  collapsedMeals: Record<MealType, boolean>;
  setCollapsedMeals: (
    value:
      | Record<MealType, boolean>
      | ((prev: Record<MealType, boolean>) => Record<MealType, boolean>)
  ) => void;
}

const getMealTypeLabel = (type: MealType) => {
  const labels: Record<MealType, string> = {
    breakfast: "朝食",
    lunch: "昼食",
    dinner: "夕食",
  };
  return labels[type];
};

export function WeeklyMealPlan() {
  const [weeklyMeals, setWeeklyMeals] = useState<Record<string, DailyMeals>>(
    {}
  );
  const { fetchMealPlans, loading } = useMealPlans();
  const { refresh } = useLocalSearchParams();

  // 日付とmealTypeの組み合わせで折りたたみ状態を管理
  const [collapsedStates, setCollapsedStates] = useState<
    Record<string, Record<MealType, boolean>>
  >({});

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  // 初期状態の設定
  useEffect(() => {
    const initialStates = weekDays.reduce((acc, date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      acc[dateKey] = {
        breakfast: false,
        lunch: false,
        dinner: false,
      };
      return acc;
    }, {} as Record<string, Record<MealType, boolean>>);
    setCollapsedStates(initialStates);
  }, []);

  const loadMeals = async () => {
    const startDate = weekDays[0];
    const endDate = weekDays[weekDays.length - 1];
    const mealPlans = await fetchMealPlans(startDate, endDate);

    if (mealPlans) {
      const groupedMeals: Record<string, DailyMeals> = {};
      mealPlans.forEach((plan) => {
        const dateKey = plan.date;
        if (!groupedMeals[dateKey]) {
          groupedMeals[dateKey] = {};
        }
        if (!groupedMeals[dateKey][plan.meal_type]) {
          groupedMeals[dateKey][plan.meal_type] = [];
        }
        groupedMeals[dateKey][plan.meal_type].push({
          id: plan.id,
          recipe: plan.recipe!,
        });
      });
      setWeeklyMeals(groupedMeals);
    }
  };

  useEffect(() => {
    loadMeals();
  }, [refresh]);

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadMeals}
          colors={[COLORS.primary]}
        />
      }
    >
      {weekDays.map((date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        return (
          <View key={date.toISOString()} style={styles.dayContainer}>
            <ThemedText style={styles.date}>
              {format(date, "M月d日(E)", { locale: ja })}
            </ThemedText>
            <DayPlan
              date={date}
              meals={weeklyMeals[dateKey] || {}}
              onUpdate={loadMeals}
              collapsedMeals={collapsedStates[dateKey] || {}}
              setCollapsedMeals={(newState) => {
                setCollapsedStates((prev) => ({
                  ...prev,
                  [dateKey]:
                    typeof newState === "function"
                      ? newState(prev[dateKey])
                      : newState,
                }));
              }}
            />
          </View>
        );
      })}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function DayPlan({
  date,
  meals,
  onUpdate,
  collapsedMeals,
  setCollapsedMeals,
}: DayPlanProps) {
  const { deleteMealPlan } = useMealPlans();
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const toggleMeal = (type: MealType) => {
    setCollapsedMeals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handlePress = (type: MealType) => {
    router.push({
      pathname: "/plans/create",
      params: {
        date: format(date, "yyyy-MM-dd"),
        mealType: type,
        from: "calendar",
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
            if (success && onUpdate) {
              onUpdate();
            } else if (!success) {
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
    <View style={styles.container}>
      {mealTypes.map((type) => (
        <View key={type} style={styles.mealSection}>
          <Pressable
            onPress={() => toggleMeal(type)}
            style={[
              styles.mealHeader,
              { backgroundColor: COLORS.mealTypes[type] },
            ]}
          >
            <View style={styles.headerLeft}>
              <Ionicons
                name={
                  type === "breakfast"
                    ? "sunny-outline"
                    : type === "lunch"
                    ? "restaurant-outline"
                    : "moon-outline"
                }
                size={24}
                color="white"
              />
              <ThemedText style={styles.mealType}>
                {getMealTypeLabel(type)}
              </ThemedText>
            </View>
            <View style={styles.headerRight}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handlePress(type);
                }}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="add-circle" size={24} color="white" />
              </Pressable>
              <Ionicons
                name={collapsedMeals[type] ? "chevron-down" : "chevron-up"}
                size={24}
                color="white"
              />
            </View>
          </Pressable>

          {!collapsedMeals[type] && (
            <View style={styles.mealContent}>
              {meals[type]?.length > 0 ? (
                <View style={styles.recipeList}>
                  {meals[type].map((meal, index) => (
                    <View key={index} style={styles.recipeItem}>
                      <RecipeCard
                        recipe={meal.recipe}
                        compact
                        mealPlanId={meal.id}
                        onDelete={() => handleDelete(meal.id)}
                        onPress={() =>
                          router.push({
                            pathname: "/recipes/[id]" as const,
                            params: {
                              id: meal.recipe.id,
                              from: "plans",
                            },
                          })
                        }
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <Pressable
                  onPress={() => handlePress(type)}
                  style={({ pressed }) => [
                    styles.emptyContainer,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText style={styles.emptyText}>
                    タップしてメニューを設定
                  </ThemedText>
                </Pressable>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  dayContainer: {
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    borderRadius: 12,
    overflow: "hidden",
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  mealSection: {
    backgroundColor: COLORS.card,
    marginBottom: 1,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealType: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  mealContent: {
    padding: 16,
  },
  addButton: {
    padding: 4,
  },
  recipeList: {
    gap: 12,
  },
  recipeItem: {
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  bottomPadding: {
    height: 32,
  },
});
