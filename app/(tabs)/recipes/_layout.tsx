import { Stack } from "expo-router";

export default function RecipesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "レシピ一覧",
          headerShown: false, // ここを追加
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "レシピ詳細",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "新規作成",
        }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{
          title: "レシピ編集",
        }}
      />
    </Stack>
  );
}
