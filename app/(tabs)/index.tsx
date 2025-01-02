// app/(tabs)/index.tsx
import { DayPlan, WeeklyMealPlan } from "../../components/meal-plan/DayPlan";
import { ThemedView } from "../../components/ui/ThemedView";

export default function Home() {
  return (
    <ThemedView>
      <WeeklyMealPlan />
    </ThemedView>
  );
}
