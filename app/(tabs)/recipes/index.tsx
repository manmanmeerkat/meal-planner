// app/(tabs)/recipes/index.tsx
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { RecipeCard } from "../../../components/recipe/RecipeCard";
import { useRecipes } from "../../../hooks/useRecipes";
import { Ionicons } from "@expo/vector-icons";

export default function RecipeList() {
  const { recipes, fetchRecipes, loading } = useRecipes();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>レシピ一覧</ThemedText>
        <Pressable
          onPress={() => setIsCompact(!isCompact)}
          style={styles.viewToggle}
        >
          <Ionicons
            name={isCompact ? "list" : "grid"}
            size={24}
            color="#4A5568"
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              onPress={() => router.push(`/recipes/${recipe.id}`)}
              style={({ pressed }) => [
                styles.recipeCard,
                pressed && styles.pressed,
              ]}
            >
              <RecipeCard recipe={recipe} compact={isCompact} />
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              レシピがありません。{"\n"}
              新しいレシピを追加してみましょう！
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* FABを追加 */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/recipes/create")}
      >
        <View style={styles.fabContent}>
          <Ionicons name="add" size={24} color="white" />
        </View>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F7FAFC",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // FABの分の余白を追加
  },
  recipeCard: {
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  // FAB用のスタイルを追加
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabContent: {
    width: 56,
    height: 56,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
    justifyContent: "center",
  },
});
