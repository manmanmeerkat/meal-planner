import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedView } from "../../../../components/ui/ThemedView";
import { ThemedText } from "../../../../components/ui/ThemedText";
import { RecipeForm } from "../../../../components/recipe/RecipeForm";
import { useRecipes } from "../../../../hooks/useRecipes";
import { Recipe } from "../../../../types/recipe";
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

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const { getRecipe, updateRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    const data = await getRecipe(id as string);
    setRecipe(data);
  };

  const handleSubmit = async (data: Omit<Recipe, "id">) => {
    const result = await updateRecipe(id as string, data);
    if (result) {
      router.push({
        pathname: "/(tabs)/recipes",
        params: { refresh: Date.now().toString() },
      });
    }
  };

  if (!recipe) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </Pressable>
          <ThemedText style={styles.title}>レシピを編集</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <RecipeForm
          onSubmit={handleSubmit}
          initialData={recipe}
          loading={loading}
        />
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
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
