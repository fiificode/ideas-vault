import BoardCard from "@/components/BoardCard";
import EmptyState from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function BoardsScreen() {
  const router = useRouter();
  const { boards, ideas } = useBoardStore();

  const navigateToCreateBoard = () => {
    router.push("/modal/create-board");
  };

  if (boards.length === 0) {
    return (
      <EmptyState
        title="No Boards Yet"
        message="Create your first idea board to start organizing your thoughts and projects."
        buttonText="Create Board"
        onPress={navigateToCreateBoard}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardCard board={item} ideas={ideas} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
});
