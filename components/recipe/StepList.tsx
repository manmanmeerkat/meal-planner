import { View, TextInput, Button, StyleSheet } from "react-native";

interface StepListProps {
  steps: string[];
  onUpdate: (steps: string[]) => void;
}

export function StepList({ steps, onUpdate }: StepListProps) {
  const addStep = () => {
    onUpdate([...steps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const updated = steps.map((step, i) => (i === index ? value : step));
    onUpdate(updated);
  };

  return (
    <View>
      {steps.map((step, index) => (
        <TextInput
          key={index}
          value={step}
          onChangeText={(value) => updateStep(index, value)}
          placeholder={`手順${index + 1}`}
          multiline
          style={styles.input}
        />
      ))}
      <Button title="手順を追加" onPress={addStep} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
});
