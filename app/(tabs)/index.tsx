import BoardCard from "@/components/BoardCard";
import EmptyState from "@/components/EmptyState";
import IdeaCard from "@/components/IdeaCard";
import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import { Idea } from "@/types";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { boards, ideas } = useBoardStore();
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    // Get the 5 most recent ideas
    const sorted = [...ideas].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setRecentIdeas(sorted.slice(0, 5));
  }, [ideas]);

  const navigateToCreateBoard = () => {
    router.push("/modal/create-board");
  };

  if (boards.length === 0) {
    return (
      <EmptyState
        title="Welcome to Ideascape!"
        message="Start by creating your first idea board. Boards help you organize related ideas into collections."
        buttonText="Create First Board"
        onPress={navigateToCreateBoard}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Ideascape</Text>
        <Text style={styles.subtitle}>Organize and track your ideas</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Boards</Text>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={navigateToCreateBoard}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Board</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.boardsContainer}
        >
          {boards.map((board) => (
            <View key={board.id} style={styles.boardCardWrapper}>
              <BoardCard board={board} ideas={ideas} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Ideas</Text>
        </View>

        {recentIdeas.length > 0 ? (
          recentIdeas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
        ) : (
          <Text style={styles.emptyText}>
            You haven&apos;t created any ideas yet. Go to a board to add your
            first idea.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 4,
  },
  boardsContainer: {
    paddingBottom: 8,
  },
  boardCardWrapper: {
    width: 280,
    marginRight: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
});
