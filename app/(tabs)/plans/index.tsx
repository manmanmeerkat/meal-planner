// app/(tabs)/plans/index.tsx
import { StyleSheet } from "react-native";
import { ThemedView } from "../../../components/ui/ThemedView";
import { WeeklyMealPlan } from "../../../components/meal-plan/DayPlan";

export default function PlanIndex() {
  return (
    <ThemedView style={styles.container}>
      <WeeklyMealPlan />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
