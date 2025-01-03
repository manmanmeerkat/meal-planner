// components/ui/Input.tsx
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface InputProps extends Omit<TextInputProps, "style"> {
  error?: string;
  suffix?: string;
  style?: ViewStyle;
}

export function Input({ error, style, suffix, ...props }: InputProps) {
  return (
    <View style={style}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            suffix && styles.inputWithSuffix,
            props.multiline && styles.multilineInput,
          ]}
          placeholderTextColor="#A0AEC0"
          {...props}
        />
        {suffix && <ThemedText style={styles.suffix}>{suffix}</ThemedText>}
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2D3748",
  },
  inputError: {
    borderColor: "#E53E3E",
  },
  inputWithSuffix: {
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  suffix: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
    color: "#718096",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
  },
});
