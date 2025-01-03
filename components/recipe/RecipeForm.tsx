import { View, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useState } from "react";
import { Recipe } from "../../types/recipe";

interface RecipeFormProps {
  onSubmit: (data: Omit<Recipe, "id">) => void;
  initialData?: Partial<Omit<Recipe, "id">>;
}

interface Ingredient {
  name: string;
  amount: string;
}

export function RecipeForm({ onSubmit, initialData }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [cookingTime, setCookingTime] = useState(
    initialData?.cooking_time?.toString() ?? ""
  );
  const [servings, setServings] = useState(
    initialData?.servings?.toString() ?? ""
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [{ name: "", amount: "" }]
  );
  const [steps, setSteps] = useState<string[]>(initialData?.steps ?? [""]);
  const [calories, setCalories] = useState(
    initialData?.calories?.toString() ?? ""
  );

  // バリデーションの状態
  const [errors, setErrors] = useState<{
    title?: string;
    cookingTime?: string;
    servings?: string;
  }>({});

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "レシピ名を入力してください";
    }

    if (cookingTime && isNaN(Number(cookingTime))) {
      newErrors.cookingTime = "数値を入力してください";
    }

    if (servings && isNaN(Number(servings))) {
      newErrors.servings = "数値を入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      title,
      description,
      cooking_time: parseInt(cookingTime) || 0,
      servings: parseInt(servings) || 0,
      image_url: "https://via.placeholder.com/300",
      ingredients: ingredients.filter((i) => i.name && i.amount),
      steps: steps.filter((s) => s),
      calories: parseInt(calories) || 0,
    });
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        {/* 基本情報セクション */}
        <View style={styles.mainSection}>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.mainSectionTitle}>基本情報</ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>レシピ名</ThemedText>
            <Input
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              placeholder="例：肉じゃが"
              style={styles.marginBottom}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>レシピの説明</ThemedText>
            <Input
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="レシピの説明や特徴を入力してください"
              style={styles.marginBottom}
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>所要時間と分量</ThemedText>
            <View style={styles.row}>
              <View style={[styles.flex1, styles.marginRight]}>
                <Input
                  value={cookingTime}
                  onChangeText={setCookingTime}
                  keyboardType="numeric"
                  error={errors.cookingTime}
                  placeholder="分"
                  suffix="分"
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  value={servings}
                  onChangeText={setServings}
                  keyboardType="numeric"
                  error={errors.servings}
                  placeholder="人数"
                  suffix="人分"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>カロリー</ThemedText>
            <Input
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholder="kcal"
              suffix="kcal"
            />
          </View>
        </View>

        {/* 材料セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>材料</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {ingredients.length}
                </ThemedText>
              </View>
            </View>
          </View>

          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={[styles.flex2, styles.marginRight]}>
                <Input
                  value={ingredient.name}
                  onChangeText={(value) =>
                    updateIngredient(index, "name", value)
                  }
                  placeholder="例：玉ねぎ"
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  value={ingredient.amount}
                  onChangeText={(value) =>
                    updateIngredient(index, "amount", value)
                  }
                  placeholder="例：1個"
                />
              </View>
              {ingredients.length > 1 && (
                <Button
                  icon="trash"
                  onPress={() => removeIngredient(index)}
                  style={styles.removeButton}
                  variant="ghost"
                />
              )}
            </View>
          ))}
          <Button
            title="材料を追加"
            icon="add"
            onPress={addIngredient}
            style={styles.addButton}
            variant="outline"
          />
        </View>

        {/* 手順セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>手順</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{steps.length}</ThemedText>
              </View>
            </View>
          </View>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <ThemedText style={styles.stepNumber}>
                  Step {index + 1}
                </ThemedText>
                {steps.length > 1 && (
                  <Button
                    icon="trash"
                    onPress={() => removeStep(index)}
                    variant="ghost"
                    style={styles.removeButton}
                  />
                )}
              </View>
              <Input
                value={step}
                onChangeText={(value) => updateStep(index, value)}
                multiline
                placeholder="手順を入力してください"
                style={styles.stepInput}
                numberOfLines={3}
              />
            </View>
          ))}
          <Button
            title="手順を追加"
            icon="add"
            onPress={addStep}
            style={styles.addButton}
            variant="outline"
          />
        </View>

        <Button
          title="レシピを保存"
          onPress={handleSubmit}
          style={styles.submitButton}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  mainSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  mainSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
  },
  badge: {
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4299E1",
  },
  marginBottom: {
    marginBottom: 16,
  },
  marginRight: {
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
  },
  stepInput: {
    marginBottom: 8,
  },
  addButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  removeButton: {
    marginLeft: 8,
  },
  submitButton: {
    marginVertical: 24,
    backgroundColor: "#4299E1",
    paddingVertical: 16,
    borderRadius: 12,
  },
});
