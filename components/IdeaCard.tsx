import { colors } from "@/constants/colors";
import { Idea } from "@/types";
import { calculateProgress, formatDate, getStatusText } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Lightbulb } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type IdeaCardProps = {
  idea: Idea;
};

export default function IdeaCard({ idea }: IdeaCardProps) {
  const router = useRouter();

  const completedMilestones = idea.milestones.filter((m) => m.completed).length;
  const progress = calculateProgress(
    completedMilestones,
    idea.milestones.length
  );

  const handlePress = () => {
    router.push(`/idea/${idea.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Lightbulb size={20} color={colors.primary} />
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: colors.statusColors[idea.status] },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(idea.status)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {idea.title}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {idea.description}
      </Text>

      {idea.imageUrls.length > 0 && (
        <Image
          source={{ uri: idea.imageUrls[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {idea.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {idea.tags.slice(0, 3).map((tag) => (
            <View
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color + "20" }]}
            >
              <Text style={[styles.tagText, { color: tag.color }]}>
                {tag.name}
              </Text>
            </View>
          ))}
          {idea.tags.length > 3 && (
            <Text style={styles.moreTag}>+{idea.tags.length - 3}</Text>
          )}
        </View>
      )}

      {idea.milestones.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedMilestones}/{idea.milestones.length} milestones
          </Text>
        </View>
      )}

      <Text style={styles.date}>Updated {formatDate(idea.updatedAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moreTag: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    alignSelf: "center",
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
  },
});
