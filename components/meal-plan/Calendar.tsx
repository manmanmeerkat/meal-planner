// components/meal-plan/Calendar.tsx
import { View } from "react-native";
import { DayPlan } from "./DayPlan";

interface MealPlanCalendarProps {
  plans: Record<string, any>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MealPlanCalendar({
  plans,
  selectedDate,
  onSelectDate,
}: MealPlanCalendarProps) {
  return (
    <View>
      <DayPlan
        date={selectedDate}
        meals={plans[selectedDate.toISOString().split("T")[0]]}
      />
    </View>
  );
}
