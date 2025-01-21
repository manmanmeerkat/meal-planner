// app/(tabs)/recipes/create.tsx
import { StyleSheet, View, Alert } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "../../../components/ui/ThemedView";
import { ThemedText } from "../../../components/ui/ThemedText";
import { RecipeForm } from "../../../components/recipe/RecipeForm";
import { useRecipes } from "../../../hooks/useRecipes";

const COLORS = {
  primary: "#FF6B6B",
  background: "#F5F7FA",
  header: "#FF6B6B",
  headerText: "#FFFFFF",
};

export default function CreateRecipe() {
  const { createRecipe } = useRecipes();

  const handleSubmit = async (data: any) => {
    try {
      await createRecipe(data);
      router.push({
        pathname: "/(tabs)/recipes",
        params: { refresh: Date.now() },
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("エラー", error.message);
      } else {
        Alert.alert("エラー", "レシピの保存に失敗しました。");
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>レシピの作成</ThemedText>
      </View>
      <RecipeForm onSubmit={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: COLORS.header,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.headerText,
    marginTop: 8,
  },
});
