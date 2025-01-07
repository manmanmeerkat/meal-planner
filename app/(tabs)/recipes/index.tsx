// app/(tabs)/recipes/index.tsx
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { RecipeCard } from "../../../components/recipe/RecipeCard";
import { useRecipes } from "../../../hooks/useRecipes";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES, COOKING_TIMES } from "../../../constants/recipeFilters";

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

export default function RecipeList() {
  const { recipes, fetchRecipes, loading } = useRecipes();
  const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { refresh } = useLocalSearchParams<{ refresh: string }>();

  useEffect(() => {
    const loadData = async () => {
      await fetchRecipes(true);
    };
    loadData();
  }, [refresh]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesQuery =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || recipe.category === selectedCategory;

    let matchesTime = true;
    if (selectedTime !== "all") {
      const time = parseInt(selectedTime);
      if (selectedTime === "over60") {
        matchesTime = recipe.cooking_time > 60;
      } else {
        matchesTime = recipe.cooking_time <= time;
      }
    }

    return matchesQuery && matchesCategory && matchesTime;
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.title}>レシピ一覧</ThemedText>
          <View style={styles.headerButtons}>
            <Pressable
              onPress={() => setShowSearch(!showSearch)}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="search"
                size={24}
                color={showSearch ? "white" : "rgba(255, 255, 255, 0.8)"}
              />
            </Pressable>
            <Pressable
              onPress={() => setShowFilters(!showFilters)}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="filter"
                size={24}
                color={showFilters ? "white" : "rgba(255, 255, 255, 0.8)"}
              />
            </Pressable>
            <Pressable
              onPress={() => setIsCompact(!isCompact)}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={isCompact ? "list" : "grid"}
                size={24}
                color="rgba(255, 255, 255, 0.8)"
              />
            </Pressable>
          </View>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.text.secondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="レシピ・材料を検索"
              style={styles.searchInput}
              clearButtonMode="while-editing"
              placeholderTextColor={COLORS.text.secondary}
            />
          </View>
        </View>
      )}

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterSection}
          >
            <ThemedText style={styles.filterLabel}>カテゴリー:</ThemedText>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedCategory === category.id && styles.filterChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    selectedCategory === category.id &&
                      styles.filterChipTextSelected,
                  ]}
                >
                  {category.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterSection}
          >
            <ThemedText style={styles.filterLabel}>調理時間:</ThemedText>
            {COOKING_TIMES.map((time) => (
              <Pressable
                key={time.id}
                onPress={() => setSelectedTime(time.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedTime === time.id && styles.filterChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    selectedTime === time.id && styles.filterChipTextSelected,
                  ]}
                >
                  {time.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/recipes/[id]",
                  params: {
                    id: recipe.id,
                    from: "recipes",
                  },
                })
              }
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
            <Ionicons
              name={searchQuery ? "search-outline" : "book-outline"}
              size={48}
              color={COLORS.text.secondary}
            />
            <ThemedText style={styles.emptyText}>
              {searchQuery
                ? "レシピが見つかりませんでした"
                : "レシピがありません。\n新しいレシピを追加してみましょう！"}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingTop: 32, // iOSのステータスバーの高さを考慮
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16, // 上下左右均等なパディング
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  filtersContainer: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 8,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginRight: 8,
    alignSelf: "center",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F7FAFC",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  filterChipTextSelected: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  recipeCard: {
    marginBottom: 16,
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
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 16,
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
