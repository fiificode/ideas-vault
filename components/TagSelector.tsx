import { colors } from "@/constants/colors";
import { Tag } from "@/types";
import { Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const TAG_COLORS = [
  "#4A6FA5", // Primary blue
  "#9DD9D2", // Secondary mint
  "#F87171", // Red
  "#FBBF24", // Yellow
  "#34D399", // Green
  "#818CF8", // Indigo
  "#F472B6", // Pink
];

type TagSelectorProps = {
  tags: Tag[];
  onAddTag: (name: string, color: string) => void;
  onRemoveTag: (id: string) => void;
};

export default function TagSelector({
  tags,
  onAddTag,
  onRemoveTag,
}: TagSelectorProps) {
  const [newTag, setNewTag] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim(), selectedColor);
      setNewTag("");
      // Rotate to next color for variety
      const currentIndex = TAG_COLORS.indexOf(selectedColor);
      const nextIndex = (currentIndex + 1) % TAG_COLORS.length;
      setSelectedColor(TAG_COLORS[nextIndex]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tags</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add a new tag..."
            placeholderTextColor={colors.textSecondary}
            returnKeyType="done"
            onSubmitEditing={handleAddTag}
          />
          <Pressable
            style={({ pressed }) => [
              styles.colorIndicator,
              { backgroundColor: selectedColor },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              const currentIndex = TAG_COLORS.indexOf(selectedColor);
              const nextIndex = (currentIndex + 1) % TAG_COLORS.length;
              setSelectedColor(TAG_COLORS[nextIndex]);
            }}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAddTag}
          disabled={!newTag.trim()}
        >
          <Plus size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {tags.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
        >
          {tags.map((tag) => (
            <View
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color + "20" }]}
            >
              <Text style={[styles.tagText, { color: tag.color }]}>
                {tag.name}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.removeTagButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => onRemoveTag(tag.id)}
              >
                <X size={12} color={tag.color} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>
          No tags yet. Add tags to categorize your idea.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    color: colors.text,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  tagsContainer: {
    paddingVertical: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
});
