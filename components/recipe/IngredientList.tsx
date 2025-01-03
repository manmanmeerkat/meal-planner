import { View, TextInput, Button, StyleSheet } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface Ingredient {
  name: string;
  amount: string;
}

interface IngredientListProps {
  ingredients: Ingredient[];
  onUpdate: (ingredients: Ingredient[]) => void;
}

export function IngredientList({ ingredients, onUpdate }: IngredientListProps) {
  const addIngredient = () => {
    onUpdate([...ingredients, { name: "", amount: "" }]);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onUpdate(updated);
  };

  return (
    <View>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            value={ingredient.name}
            onChangeText={(value) => updateIngredient(index, "name", value)}
            placeholder="材料名"
            style={styles.input}
          />
          <TextInput
            value={ingredient.amount}
            onChangeText={(value) => updateIngredient(index, "amount", value)}
            placeholder="量"
            style={styles.input}
          />
        </View>
      ))}
      <Button title="材料を追加" onPress={addIngredient} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
});
