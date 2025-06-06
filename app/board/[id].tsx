import EmptyState from "@/components/EmptyState";
import IdeaCard from "@/components/IdeaCard";
import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MoreHorizontal, Plus } from "lucide-react-native";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function BoardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { boards, ideas } = useBoardStore();

  const board = boards.find((b) => b.id === id);
  const boardIdeas = ideas.filter((idea) => idea.boardId === id);

  const navigateToCreateIdea = () => {
    router.push({
      pathname: "/modal/create-idea",
      params: { boardId: id },
    });
  };

  if (!board) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Board not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: board.title,
          headerRight: () => (
            <Pressable style={styles.headerButton}>
              <MoreHorizontal size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.description}>{board.description}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {boardIdeas.length} {boardIdeas.length === 1 ? "idea" : "ideas"}
          </Text>
          <Text style={styles.statsText}>
            {boardIdeas.filter((i) => i.status === "completed").length}{" "}
            completed
          </Text>
        </View>
      </View>

      {boardIdeas.length > 0 ? (
        <FlatList
          data={boardIdeas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IdeaCard idea={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No Ideas Yet"
          message="Start adding ideas to this board to track your thoughts and progress."
          buttonText="Add First Idea"
          onPress={navigateToCreateIdea}
        />
      )}

      {boardIdeas.length > 0 && (
        <View style={styles.fabContainer}>
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            onPress={navigateToCreateIdea}
          >
            <Plus size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
  },
  statsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginRight: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 24,
  },
});
