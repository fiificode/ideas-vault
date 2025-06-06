import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import { Stack, useRouter } from "expo-router";
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

export default function CreateBoardScreen() {
  const router = useRouter();
  const { addBoard } = useBoardStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a board title");
      return;
    }

    setIsSubmitting(true);
    try {
      const newBoard = addBoard(title.trim(), description.trim());
      Alert.alert("Success", "Board created successfully!", [
        {
          text: "OK",
          onPress: () => router.push(`/board/${newBoard.id}`),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create board. Please try again.");
      console.error("Error creating board:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim().length > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Text style={styles.headerButtonText}>Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              style={[
                styles.headerButton,
                (!isValid || isSubmitting) && styles.headerButtonDisabled,
              ]}
              onPress={handleCreate}
              disabled={!isValid || isSubmitting}
            >
              <Text
                style={[
                  styles.headerButtonText,
                  styles.createButtonText,
                  (!isValid || isSubmitting) && styles.headerButtonTextDisabled,
                ]}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Board Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter board title..."
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="What is this board about?"
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.helperText}>
          Boards help you organize related ideas into collections. For example,
          you might create boards for "App Ideas", "Home Renovation", or
          "Writing Projects".
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.createButtonLarge,
            !isValid && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreate}
          disabled={!isValid || isSubmitting}
        >
          <Text style={styles.createButtonLargeText}>
            {isSubmitting ? "Creating..." : "Create Board"}
          </Text>
        </Pressable>
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
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
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  createButtonText: {
    color: colors.primary,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonTextDisabled: {
    color: colors.textSecondary,
  },
  createButtonLarge: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  createButtonLargeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
