// components/ui/Button.tsx
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  style,
  variant = "primary",
  icon,
  disabled,
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryButton;
      case "secondary":
        return styles.secondaryButton;
      case "outline":
        return styles.outlineButton;
      case "ghost":
        return styles.ghostButton;
      case "destructive":
        return styles.destructiveButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryText;
      case "secondary":
      case "outline":
        return styles.secondaryText;
      case "ghost":
        return styles.ghostText;
      case "destructive":
        return styles.destructiveText;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        getVariantStyle(),
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={variant === "primary" ? "#FFFFFF" : "#4A5568"}
            style={title ? styles.iconWithText : undefined}
          />
        )}
        {title && (
          <ThemedText style={[styles.text, getTextStyle()]}>{title}</ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWithText: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
  // Primary
  primaryButton: {
    backgroundColor: "#4299E1",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  // Secondary
  secondaryButton: {
    backgroundColor: "#EBF8FF",
  },
  secondaryText: {
    color: "#4299E1",
  },
  // Outline
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  // Ghost
  ghostButton: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: "#4A5568",
  },
  // Destructive
  destructiveButton: {
    backgroundColor: "#FED7D7",
  },
  destructiveText: {
    color: "#E53E3E",
  },
  disabled: {
    opacity: 0.5,
  },
});
