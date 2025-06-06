import ImageGallery from "@/components/ImageGallery";
import MilestoneList from "@/components/MilestoneList";
import StatusSelector from "@/components/StatusSelector";
import TagSelector from "@/components/TagSelector";
import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import { formatDate } from "@/utils/helpers";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    ideas,
    boards,
    updateIdea,
    deleteIdea,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    addTag,
    removeTag,
    addImageToIdea,
    removeImageFromIdea,
    updateIdeaStatus,
  } = useBoardStore();

  const idea = ideas.find((i) => i.id === id);
  const [title, setTitle] = useState(idea?.title || "");
  const [description, setDescription] = useState(idea?.description || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!idea) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Idea not found</Text>
      </View>
    );
  }

  const board = boards.find((b) => b.id === idea.boardId);

  const handleSave = () => {
    updateIdea(id, {
      title,
      description,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Idea",
      "Are you sure you want to delete this idea? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteIdea(id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isEditing ? "Edit Idea" : idea.title,
          headerRight: () => (
            <Pressable style={styles.headerButton} onPress={handleDelete}>
              <Trash2 size={20} color={colors.error} />
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Idea Title"
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your idea..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.editButtons}>
              <Pressable
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => {
                  setTitle(idea.title);
                  setDescription(idea.description);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.editButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{idea.title}</Text>
              <Pressable
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.boardName}>In board: {board?.title}</Text>
            <Text style={styles.date}>
              Created {formatDate(idea.createdAt)}
            </Text>
            <Text style={styles.description}>{idea.description}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <StatusSelector
          currentStatus={idea.status}
          onStatusChange={(status) => updateIdeaStatus(id, status)}
        />

        <ImageGallery
          images={idea.imageUrls}
          onAddImage={(uri) => addImageToIdea(id, uri)}
          onRemoveImage={(uri) => removeImageFromIdea(id, uri)}
        />

        <TagSelector
          tags={idea.tags}
          onAddTag={(name, color) => addTag(id, name, color)}
          onRemoveTag={(tagId) => removeTag(id, tagId)}
        />

        <MilestoneList
          milestones={idea.milestones}
          onAddMilestone={(title) => addMilestone(id, title)}
          onToggleMilestone={(milestoneId) => toggleMilestone(id, milestoneId)}
          onDeleteMilestone={(milestoneId) => deleteMilestone(id, milestoneId)}
        />
      </ScrollView>
    </View>
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
  headerSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  boardName: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  editContainer: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    height: 120,
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: "500",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: "500",
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
