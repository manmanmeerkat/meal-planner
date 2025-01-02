// components/recipe/RecipeCard.tsx
import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Recipe } from "../../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCard: {
    flexDirection: "row",
    height: 80,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Image
        source={{ uri: recipe.image_url }}
        style={[styles.image, compact && styles.compactImage]}
      />
      <View style={styles.content}>
        <ThemedText style={styles.title}>{recipe.title}</ThemedText>
        {!compact && (
          <ThemedText style={styles.description}>
            {recipe.description}
          </ThemedText>
        )}
      </View>
    </View>
  );
}
