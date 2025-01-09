// app/(tabs)/plans/create.tsx
import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { RecipeCard } from "../../../components/recipe/RecipeCard";
import { useMealPlans } from "../../../hooks/useMealPlan";
import { useRecipes } from "../../../hooks/useRecipes";
import { Ionicons } from "@expo/vector-icons";
import { MealType } from "../../../types/mealPlans";
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
  mealTypes: {
    breakfast: "#FFB347",
    lunch: "#4ECDC4",
    dinner: "#A78BFA",
  },
};

export default function CreatePlan() {
  const params = useLocalSearchParams();
  const { addMealPlan } = useMealPlans();
  const { recipes, fetchRecipes, loading } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCompact, setIsCompact] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSelectRecipe = async (recipeId: string) => {
    if (!params.date || !params.mealType) return;

    const result = await addMealPlan({
      date: params.date as string,
      meal_type: params.mealType as MealType,
      recipe_id: recipeId,
    });

    const destination = params.from === "home" ? "/(tabs)" : "/(tabs)/plans";
    router.push({
      pathname: destination,
      params: { refresh: Date.now() },
    });
  };

  const getMealTypeColor = (mealType: string) => {
    return (
      COLORS.mealTypes[mealType as keyof typeof COLORS.mealTypes] ||
      COLORS.primary
    );
  };

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
      <View
        style={[
          styles.header,
          { backgroundColor: getMealTypeColor(params.mealType as string) },
        ]}
      >
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <ThemedText style={styles.title}>レシピを選択</ThemedText>
          <View style={styles.headerButtons}>
            <Pressable
              onPress={() => setShowFilters(!showFilters)}
              style={({ pressed }) => [
                styles.headerButton,
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
                styles.headerButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={isCompact ? "list" : "grid"}
                size={24}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </View>

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

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
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
            contentContainerStyle={[styles.filterList, styles.filterListSecond]}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filteredRecipes.length > 0 ? (
          <View style={styles.recipeList}>
            {filteredRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => handleSelectRecipe(recipe.id)}
                style={({ pressed }) => [
                  styles.recipeCard,
                  pressed && styles.pressed,
                ]}
              >
                <RecipeCard recipe={recipe} compact={isCompact} />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={48}
              color={COLORS.text.secondary}
            />
            <ThemedText style={styles.emptyText}>
              レシピが見つかりませんでした
            </ThemedText>
          </View>
        )}
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
    paddingTop: 20,
    backgroundColor: COLORS.primary,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 20,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginLeft: 12,
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
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  filterListSecond: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginRight: 8,
    alignSelf: "center",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
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
  },
  recipeList: {
    gap: 16,
  },
  recipeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginTop: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
