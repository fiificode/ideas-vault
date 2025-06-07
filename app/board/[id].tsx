import EmptyState from "@/components/EmptyState";
import IdeaCard from "@/components/IdeaCard";
import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Edit,
  MoreHorizontal,
  Plus,
  Share2,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BoardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { boards, ideas, updateBoard, deleteBoard } = useBoardStore();
  const insets = useSafeAreaInsets();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const board = boards.find((b) => b.id === id);
  const boardIdeas = ideas.filter((idea) => idea.boardId === id);

  const navigateToCreateIdea = () => {
    router.push({
      pathname: "/modal/create-idea",
      params: { boardId: id },
    });
  };

  const handleEdit = () => {
    if (board) {
      setEditedTitle(board.title);
      setEditedDescription(board.description);
      setIsEditing(true);
      setIsMenuVisible(false);
    }
  };

  const handleSaveEdit = () => {
    if (board) {
      updateBoard(id, {
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Board",
      "Are you sure you want to delete this board? All ideas in this board will also be deleted. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteBoard(id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
    setIsMenuVisible(false);
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    Alert.alert(
      "Coming Soon",
      "Sharing functionality will be available in a future update!"
    );
    setIsMenuVisible(false);
  };

  if (!board) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Board not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: isEditing ? "Edit Board" : board.title,
          headerShown: true,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable
              onPress={() => (isEditing ? setIsEditing(false) : router.back())}
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
            >
              <ChevronLeft size={24} color={colors.text} />
              <Text style={{ marginLeft: 8, color: colors.text }}>
                {isEditing ? "Cancel" : "Back"}
              </Text>
            </Pressable>
          ),
          headerRight: () =>
            isEditing ? (
              <Pressable
                onPress={handleSaveEdit}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
              >
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  Save
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setIsMenuVisible(true)}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
              >
                <MoreHorizontal size={24} color={colors.text} />
              </Pressable>
            ),
        }}
      />

      {isEditing ? (
        <View style={styles.editContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Enter board title..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="What is this board about?"
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      ) : (
        <>
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
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + 80 }, // Space for FAB + bottom safe area
              ]}
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
            <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.fab,
                  pressed && styles.fabPressed,
                ]}
                onPress={navigateToCreateIdea}
              >
                <Plus size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
        </>
      )}

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <SafeAreaView style={styles.menuSafeArea}>
            <View style={styles.menuContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleEdit}
              >
                <Edit size={20} color={colors.text} />
                <Text style={styles.menuItemText}>Edit Board</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleShare}
              >
                <Share2 size={20} color={colors.text} />
                <Text style={styles.menuItemText}>Share Board</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={colors.error} />
                <Text style={[styles.menuItemText, { color: colors.error }]}>
                  Delete Board
                </Text>
              </Pressable>
              <View style={styles.menuDivider} />
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => {
                  setIsMenuVisible(false);
                  router.back();
                }}
              >
                <Text style={[styles.menuItemText, { color: colors.primary }]}>
                  Done
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: 6,
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
  },
  fabContainer: {
    position: "absolute",
    right: 16,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 8,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuSafeArea: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  editContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 120,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});
