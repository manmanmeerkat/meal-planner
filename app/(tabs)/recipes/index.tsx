// app/(tabs)/recipes/index.tsx
"use client";

import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { RecipeCard } from "../../../components/recipe/RecipeCard";
import { useRecipes } from "../../../hooks/useRecipes";

export default function RecipeIndex() {
  const { recipes, loading, fetchRecipes } = useRecipes();

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <Link href={`/recipes/${item.id}`} asChild>
            <RecipeCard recipe={item} />
          </Link>
        )}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchRecipes}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
