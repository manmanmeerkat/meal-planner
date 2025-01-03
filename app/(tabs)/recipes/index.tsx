// app/(tabs)/recipes/index.tsx
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { RecipeCard } from "../../../components/recipe/RecipeCard";
import { useRecipes } from "../../../hooks/useRecipes";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../../../types/recipe";

export default function RecipeList() {
  const { recipes, loading, error, fetchRecipes } = useRecipes();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.emptyText}>読み込み中...</ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          レシピがありません。{"\n"}
          新しいレシピを追加してみましょう！
        </ThemedText>
      </View>
    );
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <Pressable
      onPress={() => router.push(`/recipes/${item.id}`)}
      style={({ pressed }) => [
        styles.recipeContainer,
        pressed && styles.pressed,
      ]}
    >
      <RecipeCard recipe={item} />
    </Pressable>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          エラーが発生しました。{"\n"}
          もう一度お試しください。
        </ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshing={loading}
        onRefresh={fetchRecipes}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

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
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // FABの高さ分余白を追加
  },
  recipeContainer: {
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    lineHeight: 24,
  },
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
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
