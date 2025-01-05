// app/(tabs)/plans/index.tsx
import { StyleSheet } from "react-native";
import { ThemedView } from "../../../components/ui/ThemedView";
import { WeeklyMealPlan } from "../../../components/meal-plan/DayPlan";
import { useLocalSearchParams } from "expo-router";

export default function PlanIndex() {
  const { refresh } = useLocalSearchParams<{ refresh: string }>();

  return (
    <ThemedView style={styles.container}>
      <WeeklyMealPlan key={refresh} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
