// components/recipe/RecipeCard.tsx
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Recipe } from "../../types/recipe";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#3B82F6",
  secondary: "#4ECDC4",
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
  },
  border: "#E2E8F0",
};

// カテゴリーごとの色を定義
const CATEGORY_COLORS = {
  主菜: {
    background: "#FEE2E2", // 薄い赤
    border: "#FECACA",
    text: "#991B1B",
  },
  副菜: {
    background: "#DCFCE7", // 薄い緑
    border: "#BBF7D0",
    text: "#166534",
  },
  スープ: {
    background: "#E0F2FE", // 薄い青
    border: "#BAE6FD",
    text: "#075985",
  },
  その他: {
    background: "#F3F4F6", // グレー
    border: "#E5E7EB",
    text: "#374151",
  },
};

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
  mealPlanId?: string;
  onDelete?: (e?: GestureResponderEvent) => void;
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

  // カテゴリーに応じた色を取得
  const categoryColor = CATEGORY_COLORS[
    recipe.category as keyof typeof CATEGORY_COLORS
  ] || {
    background: COLORS.background,
    border: COLORS.border,
    text: COLORS.text.secondary,
  };

  const renderContent = () => (
    <View
      style={[
        styles.card,
        compact && styles.compactCard,
        {
          backgroundColor: categoryColor.background,
          borderColor: categoryColor.border,
        },
      ]}
    >
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
                <View
                  style={[
                    styles.metaItem,
                    { backgroundColor: categoryColor.border },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={categoryColor.text}
                  />
                  <ThemedText
                    style={[styles.metaText, { color: categoryColor.text }]}
                  >
                    {recipe.cooking_time}分
                  </ThemedText>
                </View>
              )}
              {recipe.servings > 0 && (
                <View
                  style={[
                    styles.metaItem,
                    { backgroundColor: categoryColor.border },
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={categoryColor.text}
                  />
                  <ThemedText
                    style={[styles.metaText, { color: categoryColor.text }]}
                  >
                    {recipe.servings}人分
                  </ThemedText>
                </View>
              )}
              {recipe.category && (
                <View
                  style={[
                    styles.metaItem,
                    { backgroundColor: categoryColor.border },
                  ]}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={16}
                    color={categoryColor.text}
                  />
                  <ThemedText
                    style={[styles.metaText, { color: categoryColor.text }]}
                  >
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
        style={({ pressed }) => [
          styles.card,
          compact && styles.compactCard,
          {
            backgroundColor: categoryColor.background,
            borderColor: categoryColor.border,
          },
          pressed && styles.cardPressed,
        ]}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return renderContent();
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 50,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 8,
  },
  compactTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  cardPressed: {
    transform: [{ scale: 0.995 }],
  },
  compactImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});
