import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

type HapticTabProps = {
  icon: keyof typeof Feather.glyphMap;
  color: string;
};

export function HapticTab({ icon, color }: HapticTabProps) {
  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <Feather name={icon} size={24} color={color} />
    </Pressable>
  );
}
