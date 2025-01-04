// components/meal-plan/DayPlan.tsx
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl } from "react-native";

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
  [key: string]: Array<{ recipe: Recipe }>;
}

interface DayPlanProps {
  date: Date;
  meals: DailyMeals;
  onUpdate?: () => void;
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
  const { fetchMealPlans, loading, mealPlans } = useMealPlans();

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  useEffect(() => {
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
          recipe: plan.recipe!,
        });
      });
      setWeeklyMeals(groupedMeals);
    }
  }, [mealPlans]);

  const loadMeals = async () => {
    const startDate = weekDays[0];
    const endDate = weekDays[weekDays.length - 1];
    await fetchMealPlans(startDate, endDate);
  };

  useEffect(() => {
    loadMeals();
  }, []);

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
      {weekDays.map((date) => (
        <View key={date.toISOString()} style={styles.dayContainer}>
          <DayPlan
            date={date}
            meals={weeklyMeals[format(date, "yyyy-MM-dd")] || {}}
            onUpdate={loadMeals}
          />
        </View>
      ))}
    </ScrollView>
  );
}

export function DayPlan({ date, meals, onUpdate }: DayPlanProps) {
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const handlePress = (type: MealType) => {
    router.push({
      pathname: "/plans/create",
      params: {
        date: format(date, "yyyy-MM-dd"),
        mealType: type,
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.date}>
        {format(date, "M月d日(E)", { locale: ja })}
      </ThemedText>
      {mealTypes.map((type) => (
        <View key={type} style={styles.mealSection}>
          <View
            style={[
              styles.mealHeader,
              { backgroundColor: COLORS.mealTypes[type] },
            ]}
          >
            <ThemedText style={styles.mealType}>
              {getMealTypeLabel(type)}
            </ThemedText>
            <Pressable
              onPress={() => handlePress(type)}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="add-circle" size={24} color="white" />
            </Pressable>
          </View>
          <View style={styles.mealContent}>
            {meals[type]?.length > 0 ? (
              <View style={styles.recipeList}>
                {meals[type].map((meal, index) => (
                  <View key={index} style={styles.recipeItem}>
                    <RecipeCard recipe={meal.recipe} compact />
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
        </View>
      ))}
    </ThemedView>
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
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    color: COLORS.text.primary,
  },
  mealSection: {
    backgroundColor: COLORS.card,
    marginBottom: 1,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  mealType: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
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
});
