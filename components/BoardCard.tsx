import { colors } from "@/constants/colors";
import { Board, Idea } from "@/types";
import { formatDate } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Folder } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type BoardCardProps = {
  board: Board;
  ideas: Idea[];
};

export default function BoardCard({ board, ideas }: BoardCardProps) {
  const router = useRouter();
  const boardIdeas = ideas.filter((idea) => idea.boardId === board.id);
  const ideaCount = boardIdeas.length;

  const handlePress = () => {
    router.push(`/board/${board.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Folder size={24} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {board.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {board.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>Updated {formatDate(board.updatedAt)}</Text>
          <Text style={styles.count}>
            {ideaCount} {ideaCount === 1 ? "idea" : "ideas"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  count: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
});
