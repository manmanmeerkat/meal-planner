import { View, ViewProps } from "react-native";
import { useColorScheme } from "react-native";

interface ThemedViewProps extends ViewProps {
  lightBg?: string;
  darkBg?: string;
}

export function ThemedView({
  style,
  lightBg = "#FFFFFF",
  darkBg = "#000000",
  ...props
}: ThemedViewProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        { backgroundColor: colorScheme === "dark" ? darkBg : lightBg },
        style,
      ]}
      {...props}
    />
  );
}
