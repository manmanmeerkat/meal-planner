// components/recipe/RecipeCard.tsx
import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Recipe } from "../../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

const COLORS = {
  primary: "#FF6B6B",
  background: "#FFFFFF",
  text: {
    primary: "#2D3748",
    secondary: "#718096",
  },
};

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      {!compact && (
        <>
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
          <View style={styles.content}>
            <ThemedText style={styles.title}>{recipe.title}</ThemedText>
            <ThemedText style={styles.description}>
              {recipe.description}
            </ThemedText>
          </View>
        </>
      )}

      {compact && (
        <View style={styles.compactContent}>
          <ThemedText style={styles.compactTitle}>{recipe.title}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  compactCard: {
    height: 60,
    backgroundColor: COLORS.background,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  compactContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});
