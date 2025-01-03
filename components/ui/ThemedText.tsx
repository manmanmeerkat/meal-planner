// components/ui/ThemedText.tsx
import { Text, TextProps } from "react-native";

export function ThemedText(props: TextProps) {
  return <Text {...props} style={[{ color: "#2D3748" }, props.style]} />;
}
