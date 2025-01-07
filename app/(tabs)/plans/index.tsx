// app/(tabs)/plans/index.tsx
import { StyleSheet, View } from "react-native";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { WeeklyMealPlan } from "../../../components/meal-plan/DayPlan";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  background: "#F5F7FA",
};

export default function PlanIndex() {
  const { refresh } = useLocalSearchParams<{ refresh: string }>();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>今週の献立</ThemedText>
      </View>
      <WeeklyMealPlan key={refresh} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
    padding: 16,
    paddingBottom: 20,
    textAlign: "center",
  },
});
