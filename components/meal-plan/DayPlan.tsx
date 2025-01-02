// components/meal-plan/DayPlan.tsx
import { View, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ThemedView } from "../ui/ThemedView";
import { ThemedText } from "../ui/ThemedText";
import { CollapsibleView } from "../ui/CollapsibleView";
import { RecipeCard } from "../recipe/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
}

interface DayPlanProps {
  date: Date;
  meals: Record<string, { recipe: Recipe }>;
}

type MealType = "breakfast" | "lunch" | "dinner";

const getMealTypeLabel = (type: MealType) => {
  const labels: Record<MealType, string> = {
    breakfast: "朝食",
    lunch: "昼食",
    dinner: "夕食",
  };
  return labels[type];
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mealSection: {
    padding: 8,
  },
  mealType: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: "#666",
  },
});

export function DayPlan({ date, meals }: DayPlanProps) {
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.date}>
        {format(new Date(date), "M月d日(E)")}
      </ThemedText>
      {mealTypes.map((type) => (
        <CollapsibleView key={type}>
          <View style={styles.mealSection}>
            <ThemedText style={styles.mealType}>
              {getMealTypeLabel(type)}
            </ThemedText>
            {meals?.[type] ? (
              <RecipeCard recipe={meals[type].recipe} compact />
            ) : (
              <ThemedText style={styles.emptyText}>
                メニューが未設定です
              </ThemedText>
            )}
          </View>
        </CollapsibleView>
      ))}
    </ThemedView>
  );
}

export function WeeklyMealPlan() {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <View>
      {weekDays.map((date) => (
        <DayPlan key={date.toISOString()} date={date} meals={{}} />
      ))}
    </View>
  );
}
