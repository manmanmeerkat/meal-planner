// components/recipe/RecipeCard.tsx
import { View, Image, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Recipe } from "../../types/recipe";
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

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
  mealPlanId?: string;
  onDelete?: () => void;
  onPress?: () => void;
}

export function RecipeCard({
  recipe,
  compact = false,
  mealPlanId,
  onDelete,
  onPress,
}: RecipeCardProps) {
  const showDeleteButton = Boolean(mealPlanId && onDelete);

  const CardComponent = onPress ? Pressable : View;

  const renderContent = () => (
    <View style={[styles.card, compact && styles.compactCard]}>
      {!compact && recipe.image_url && (
        <Image source={{ uri: recipe.image_url }} style={styles.image} />
      )}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <ThemedText
            style={[styles.title, compact && styles.compactTitle]}
            numberOfLines={1}
          >
            {recipe.title}
          </ThemedText>
          {showDeleteButton && (
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.primary} />
            </Pressable>
          )}
        </View>
        {!compact && (
          <>
            {recipe.description && (
              <ThemedText style={styles.description} numberOfLines={2}>
                {recipe.description}
              </ThemedText>
            )}
            <View style={styles.metaInfo}>
              {recipe.cooking_time > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={COLORS.text.secondary}
                  />
                  <ThemedText style={styles.metaText}>
                    {recipe.cooking_time}分
                  </ThemedText>
                </View>
              )}
              {recipe.servings > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={COLORS.text.secondary}
                  />
                  <ThemedText style={styles.metaText}>
                    {recipe.servings}人分
                  </ThemedText>
                </View>
              )}
              {recipe.category && (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="restaurant-outline"
                    size={16}
                    color={COLORS.text.secondary}
                  />
                  <ThemedText style={styles.metaText}>
                    {recipe.category}
                  </ThemedText>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return renderContent();
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    minHeight: 60,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 8,
  },
  compactTitle: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: "row",
    marginTop: 12,
    gap: 16,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  deleteButton: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
