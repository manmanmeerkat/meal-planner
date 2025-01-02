import { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface CollapsibleViewProps {
  children: React.ReactNode;
  initialExpanded?: boolean;
}

export function CollapsibleView({
  children,
  initialExpanded = true,
}: CollapsibleViewProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Feather
          name={isExpanded ? "chevron-down" : "chevron-right"}
          size={20}
          color="#666"
        />
      </Pressable>
      {isExpanded && children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  header: {
    padding: 8,
  },
});
