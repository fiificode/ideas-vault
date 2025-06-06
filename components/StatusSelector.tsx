import { colors } from "@/constants/colors";
import { Status } from "@/types";
import { getStatusText } from "@/utils/helpers";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type StatusSelectorProps = {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
};

export default function StatusSelector({
  currentStatus,
  onStatusChange,
}: StatusSelectorProps) {
  const statuses: Status[] = ["idea", "inProgress", "completed"];

  return (
    <View style={styles.container}>
      {statuses.map((status) => (
        <Pressable
          key={status}
          style={({ pressed }) => [
            styles.statusButton,
            status === currentStatus && styles.activeStatusButton,
            pressed && styles.pressedStatusButton,
            {
              backgroundColor:
                status === currentStatus
                  ? colors.statusColors[status]
                  : "transparent",
            },
          ]}
          onPress={() => onStatusChange(status)}
        >
          <Text
            style={[
              styles.statusText,
              status === currentStatus && styles.activeStatusText,
            ]}
          >
            {getStatusText(status)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeStatusButton: {
    borderColor: "transparent",
  },
  pressedStatusButton: {
    opacity: 0.8,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  activeStatusText: {
    color: colors.text,
    fontWeight: "600",
  },
});
