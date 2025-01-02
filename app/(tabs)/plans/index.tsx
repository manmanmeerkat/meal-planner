// app/(tabs)/plans/index.tsx
"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { startOfMonth, endOfMonth } from "date-fns";
import { ThemedView } from "../../../components/ui/ThemedView";
import { MealPlanCalendar } from "../../../components/meal-plan/Calendar";
import { useMealPlan } from "../../../hooks/useMealPlan";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default function PlanIndex() {
  const { mealPlans, loading, fetchMealPlans } = useMealPlan();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);
    fetchMealPlans(startDate, endDate);
  }, [selectedDate]);

  return (
    <ThemedView style={styles.container}>
      <MealPlanCalendar
        plans={mealPlans}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </ThemedView>
  );
}
