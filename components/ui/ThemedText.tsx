import { Text, TextProps } from "react-native";
import { useColorScheme } from "react-native";

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({
  style,
  lightColor = "#000000",
  darkColor = "#FFFFFF",
  ...props
}: ThemedTextProps) {
  const colorScheme = useColorScheme();

  return (
    <Text
      style={[
        { color: colorScheme === "dark" ? darkColor : lightColor },
        style,
      ]}
      {...props}
    />
  );
}
