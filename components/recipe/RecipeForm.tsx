// components/recipe/RecipeForm.tsx
import { View, ScrollView, TextInput, Button, StyleSheet } from "react-native";
import { ThemedView } from "../ui/ThemedView";
import { ThemedText } from "../ui/ThemedText";
import { useState } from "react";
import { IngredientList } from "./IngredientList";
import { StepList } from "./StepList";

interface RecipeFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});

export function RecipeForm({ onSubmit, initialData }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients ?? []
  );
  const [steps, setSteps] = useState(initialData?.steps ?? []);

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      ingredients,
      steps,
    });
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText>レシピ名</ThemedText>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <ThemedText>説明</ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>材料</ThemedText>
          <IngredientList ingredients={ingredients} onUpdate={setIngredients} />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>手順</ThemedText>
          <StepList steps={steps} onUpdate={setSteps} />
        </View>

        <Button title="保存する" onPress={handleSubmit} />
      </ThemedView>
    </ScrollView>
  );
}
