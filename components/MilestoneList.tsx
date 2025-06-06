import { colors } from "@/constants/colors";
import { Milestone } from "@/types";
import { Check, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type MilestoneListProps = {
  milestones: Milestone[];
  onAddMilestone: (title: string) => void;
  onToggleMilestone: (id: string) => void;
  onDeleteMilestone: (id: string) => void;
};

export default function MilestoneList({
  milestones,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
}: MilestoneListProps) {
  const [newMilestone, setNewMilestone] = useState("");

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      onAddMilestone(newMilestone.trim());
      setNewMilestone("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milestones</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMilestone}
          onChangeText={setNewMilestone}
          placeholder="Add a new milestone..."
          placeholderTextColor={colors.textSecondary}
          returnKeyType="done"
          onSubmitEditing={handleAddMilestone}
        />
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAddMilestone}
          disabled={!newMilestone.trim()}
        >
          <Plus size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {milestones.length > 0 ? (
        <View style={styles.milestoneList}>
          {milestones.map((milestone) => (
            <View key={milestone.id} style={styles.milestoneItem}>
              <Pressable
                style={({ pressed }) => [
                  styles.checkbox,
                  milestone.completed && styles.checkboxChecked,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => onToggleMilestone(milestone.id)}
              >
                {milestone.completed && <Check size={16} color="#FFFFFF" />}
              </Pressable>
              <Text
                style={[
                  styles.milestoneText,
                  milestone.completed && styles.milestoneTextCompleted,
                ]}
              >
                {milestone.title}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => onDeleteMilestone(milestone.id)}
              >
                <Trash2 size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          No milestones yet. Add one to track your progress.
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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    color: colors.text,
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
  milestoneList: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  milestoneText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  milestoneTextCompleted: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
});
