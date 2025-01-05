// app/(tabs)/recipes/[id].tsx
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { useRecipes } from "../../../hooks/useRecipes";
import { Recipe } from "../../../types/recipe";
import { Ionicons } from "@expo/vector-icons";

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

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { getRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      const data = await getRecipe(id as string);
      setRecipe(data);
    };
    loadRecipe();
  }, [id]);

  if (!recipe) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </Pressable>
          <Pressable
            onPress={() => router.push(`/recipes/edit/${id}`)}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={COLORS.text.primary}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.title}>{recipe.title}</ThemedText>
          <ThemedText style={styles.description}>
            {recipe.description}
          </ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>調理時間・分量</ThemedText>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={COLORS.text.secondary}
                />
                <ThemedText style={styles.infoText}>
                  {recipe.cooking_time}分
                </ThemedText>
              </View>
              <View style={styles.infoItem}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={COLORS.text.secondary}
                />
                <ThemedText style={styles.infoText}>
                  {recipe.servings}人分
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>材料</ThemedText>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <ThemedText style={styles.ingredientName}>
                  {ingredient.name}
                </ThemedText>
                <ThemedText style={styles.ingredientAmount}>
                  {ingredient.amount}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>手順</ThemedText>
            {recipe.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <ThemedText style={styles.stepNumber}>{index + 1}</ThemedText>
                <ThemedText style={styles.stepText}>{step}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.card,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  ingredientName: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  ingredientAmount: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
