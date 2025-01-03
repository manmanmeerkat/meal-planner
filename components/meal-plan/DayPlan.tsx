// components/meal-plan/DayPlan.tsx
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { router } from "expo-router";
import { ThemedView } from "../ui/ThemedView";
import { ThemedText } from "../ui/ThemedText";
import { CollapsibleView } from "../ui/CollapsibleView";
import { RecipeCard } from "../recipe/RecipeCard";
import { Recipe } from "../../types/recipe";
import { MealType } from "../../types/mealPlans";
import { useMealPlans } from "../../hooks/useMealPlan";
import { useState, useEffect } from "react";

interface DailyMeals {
  [key: string]: {
    recipe: Recipe;
  };
}

interface DayPlanProps {
  date: Date;
  meals: DailyMeals;
  onUpdate: () => void;
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

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

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
        groupedMeals[dateKey][plan.meal_type] = {
          recipe: plan.recipe!,
        };
      });
      setWeeklyMeals(groupedMeals);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
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

function DayPlan({ date, meals, onUpdate }: DayPlanProps) {
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const handlePress = (type: MealType) => {
    router.push({
      pathname: "/(tabs)/plans" as const,
      params: {
        date: date.toISOString(),
        mealType: type,
        action: "create",
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.date}>
        {format(date, "M月d日(E)", { locale: ja })}
      </ThemedText>
      {mealTypes.map((type) => (
        <Pressable
          key={type}
          onPress={() => handlePress(type)}
          style={({ pressed }) => [
            styles.mealSection,
            pressed && styles.pressed,
          ]}
        >
          <View>
            <ThemedText style={styles.mealType}>
              {getMealTypeLabel(type)}
            </ThemedText>
            {meals[type] ? (
              <RecipeCard recipe={meals[type].recipe} compact />
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  タップしてメニューを設定
                </ThemedText>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  dayContainer: {
    margin: 16,
    backgroundColor: "#FFFFFF",
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
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  mealSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  mealType: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#4A5568",
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    color: "#718096",
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});
