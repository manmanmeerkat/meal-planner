// app/(tabs)/recipes/[id].tsx
"use client";

import { useState, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { useRecipes } from "../../../hooks/useRecipes";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ingredient: {
    marginBottom: 4,
  },
  step: {
    marginBottom: 8,
  },
});

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (typeof id === "string") {
        const data = await getRecipe(id);
        setRecipe(data);
      }
    };
    loadRecipe();
  }, [id]);

  if (!recipe) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: recipe.image_url }} style={styles.image} />
        <View style={styles.content}>
          <ThemedText style={styles.title}>{recipe.title}</ThemedText>
          <ThemedText style={styles.description}>
            {recipe.description}
          </ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>材料</ThemedText>
            {recipe.ingredients.map((ingredient, index) => (
              <ThemedText key={index} style={styles.ingredient}>
                ・{ingredient.name}: {ingredient.amount}
              </ThemedText>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>手順</ThemedText>
            {recipe.steps.map((step, index) => (
              <ThemedText key={index} style={styles.step}>
                {index + 1}. {step}
              </ThemedText>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
