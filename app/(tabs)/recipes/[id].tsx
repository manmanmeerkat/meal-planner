// app/(tabs)/recipes/[id].tsx
import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 250,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  pressed: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoSeparator: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumber: {
    color: "white",
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
  ingredientName: {
    fontSize: 16,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
});

export default function RecipeDetail() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { getRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleBack = () => {
    if (from === "home") {
      router.push("/(tabs)");
    } else if (from === "plans") {
      router.push("/(tabs)/plans");
    } else {
      router.back();
    }
  };

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
      {recipe.image_url && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
          <View style={styles.imageOverlay} />
        </View>
      )}

      <View style={styles.headerButtons}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={() => router.push(`/recipes/edit/${id}`)}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="create-outline" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <ThemedText style={styles.title}>{recipe.title}</ThemedText>
            {recipe.description && (
              <ThemedText style={styles.description}>
                {recipe.description}
              </ThemedText>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color={COLORS.primary} />
              <View>
                <ThemedText style={styles.infoLabel}>調理時間</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {recipe.cooking_time}分
                </ThemedText>
              </View>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoItem}>
              <Ionicons
                name="people-outline"
                size={24}
                color={COLORS.primary}
              />
              <View>
                <ThemedText style={styles.infoLabel}>分量</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {recipe.servings}人分
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="restaurant-outline"
                size={24}
                color={COLORS.primary}
              />
              <ThemedText style={styles.sectionTitle}>材料</ThemedText>
            </View>
            <View style={styles.card}>
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
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={24} color={COLORS.primary} />
              <ThemedText style={styles.sectionTitle}>手順</ThemedText>
            </View>
            <View style={styles.card}>
              {recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumberContainer}>
                    <ThemedText style={styles.stepNumber}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.stepText}>{step}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
