// components/recipe/RecipeForm.tsx
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Button } from "../ui/Button";
import { useState } from "react";
import { Recipe } from "../../types/recipe";
import { CATEGORIES } from "../../constants/recipeFilters";
import { Input } from "../ui/Input";
import { Ionicons } from "@expo/vector-icons";

interface RecipeFormProps {
  onSubmit: (data: Omit<Recipe, "id">) => void;
  initialData?: Partial<Omit<Recipe, "id">>;
  loading?: boolean;
}

interface Ingredient {
  name: string;
  amount: string;
}

const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  background: "#F7F9FC",
  card: "#FFFFFF",
  text: {
    primary: "#2D3748",
    secondary: "#718096",
    accent: "#FF6B6B",
  },
};

export function RecipeForm({
  onSubmit,
  initialData,
  loading,
}: RecipeFormProps) {
  const [isSimpleMode, setIsSimpleMode] = useState(false);
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
  const [category, setCategory] = useState(initialData?.category ?? "main");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [{ name: "", amount: "" }]
  );
  const [steps, setSteps] = useState<string[]>(initialData?.steps ?? [""]);

  const [errors, setErrors] = useState<{
    title?: string;
    cookingTime?: string;
    servings?: string;
  }>({});

  const hasDetailedInfo = () => {
    return !!(
      description ||
      cookingTime ||
      servings ||
      ingredients.some((i) => i.name || i.amount) ||
      steps.some((s) => s)
    );
  };

  const handleModeChange = (newMode: boolean) => {
    if (newMode && !isSimpleMode && hasDetailedInfo()) {
      Alert.alert(
        "確認",
        "簡易モードに切り替えると、詳細情報の編集ができなくなりますが、既存の情報は保持されます。",
        [
          {
            text: "キャンセル",
            style: "cancel",
          },
          {
            text: "切り替える",
            onPress: () => setIsSimpleMode(newMode),
          },
        ]
      );
    } else {
      setIsSimpleMode(newMode);
    }
  };

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
      setIngredients(ingredients.filter((_, i) => i !== index));
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
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "レシピ名を入力してください";
    }

    if (!isSimpleMode) {
      if (cookingTime && isNaN(Number(cookingTime))) {
        newErrors.cookingTime = "数値を入力してください";
      }

      if (servings && isNaN(Number(servings))) {
        newErrors.servings = "数値を入力してください";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const DEFAULT_IMAGES = [
    "https://via.placeholder.com/400x300/F5F7FA/718096?text=Recipe",
    "https://via.placeholder.com/400x300/F5F7FA/718096?text=Food",
    "https://via.placeholder.com/400x300/F5F7FA/718096?text=Cooking",
  ];

  // ランダムに1つ選択する場合
  const DEFAULT_IMAGE_URL =
    DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  const handleSubmit = () => {
    if (!validate()) return;

    const recipeData = {
      title,
      category,
      image_url: isSimpleMode
        ? DEFAULT_IMAGE_URL
        : initialData?.image_url ?? "",
      calories: initialData?.calories ?? 0,
      ...(isSimpleMode
        ? {
            description: initialData?.description ?? "",
            cooking_time: initialData?.cooking_time ?? 0,
            servings: initialData?.servings ?? 0,
            ingredients: initialData?.ingredients ?? [],
            steps: initialData?.steps ?? [],
          }
        : {
            description,
            cooking_time: parseInt(cookingTime) || 0,
            servings: parseInt(servings) || 0,
            ingredients: ingredients.filter((i) => i.name && i.amount),
            steps: steps.filter((s) => s),
          }),
    };

    onSubmit(recipeData);
  };

  const styles = StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    container: {
      padding: 16,
    },
    modeSwitch: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: COLORS.card,
      borderRadius: 12,
      marginBottom: 16,
    },
    modeSwitchText: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.text.primary,
    },
    section: {
      backgroundColor: COLORS.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: COLORS.text.primary,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
      color: COLORS.text.secondary,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    spacer: {
      width: 12,
    },
    flex1: {
      flex: 1,
    },
    flex2: {
      flex: 2,
    },
    categorySection: {
      marginTop: 16,
    },
    categoryList: {
      flexGrow: 0,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: COLORS.background,
      marginRight: 8,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    categoryChipSelected: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    categoryChipText: {
      fontSize: 14,
      color: COLORS.text.primary,
    },
    categoryChipTextSelected: {
      color: "white",
    },
    ingredientRow: {
      flexDirection: "row",
      alignItems: "flex-end",
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
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.text.primary,
    },
    addButton: {
      marginTop: 8,
    },
    removeButton: {
      marginLeft: 8,
    },
    submitButton: {
      marginTop: 8,
      marginBottom: 32,
    },
    pressed: {
      opacity: 0.7,
    },
  });

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.modeSwitch}>
          <ThemedText style={styles.modeSwitchText}>簡易作成モード</ThemedText>
          <Switch
            value={isSimpleMode}
            onValueChange={handleModeChange}
            trackColor={{ false: "#E2E8F0", true: COLORS.primary }}
            thumbColor={COLORS.card}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>基本情報</ThemedText>
          <Input
            label="レシピ名"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            placeholder="例：肉じゃが"
          />

          <View style={styles.categorySection}>
            <ThemedText style={styles.label}>カテゴリー</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
            >
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    category === cat.id && styles.categoryChipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.categoryChipText,
                      category === cat.id && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.label}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {!isSimpleMode && (
          <>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>詳細情報</ThemedText>
              <Input
                label="説明"
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="レシピの説明や特徴を入力してください"
              />

              <View style={styles.row}>
                <Input
                  label="調理時間"
                  value={cookingTime}
                  onChangeText={setCookingTime}
                  keyboardType="numeric"
                  error={errors.cookingTime}
                  placeholder="分"
                  suffix="分"
                  style={styles.flex1}
                />
                <View style={styles.spacer} />
                <Input
                  label="何人分"
                  value={servings}
                  onChangeText={setServings}
                  keyboardType="numeric"
                  error={errors.servings}
                  placeholder="人数"
                  suffix="人分"
                  style={styles.flex1}
                />
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>材料</ThemedText>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <Input
                    label={`材料 ${index + 1}`}
                    value={ingredient.name}
                    onChangeText={(value) =>
                      updateIngredient(index, "name", value)
                    }
                    placeholder="例：玉ねぎ"
                    style={[styles.flex2]}
                  />
                  <View style={styles.spacer} />
                  <Input
                    label="分量"
                    value={ingredient.amount}
                    onChangeText={(value) =>
                      updateIngredient(index, "amount", value)
                    }
                    placeholder="例：1個"
                    style={[styles.flex1]}
                  />
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

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>手順</ThemedText>
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
          </>
        )}

        <Button
          title={loading ? "保存中..." : "レシピを保存"}
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
}
