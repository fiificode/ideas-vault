import { colors } from "@/constants/colors";
import { useBoardStore } from "@/store/boardStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  HelpCircle,
  Info,
  LogOut,
  Settings,
  Trash2,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../context/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { boards, ideas, deleteBoard } = useBoardStore();

  const totalIdeas = ideas.length;
  const completedIdeas = ideas.filter(
    (idea) => idea.status === "completed"
  ).length;
  const inProgressIdeas = ideas.filter(
    (idea) => idea.status === "inProgress"
  ).length;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all data and reset the app? This will sign you out and clear all boards, ideas, and settings. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset Everything",
          onPress: async () => {
            try {
              // Delete all boards (ideas will be deleted automatically)
              [...boards].forEach((board) => deleteBoard(board.id));

              // Clear all AsyncStorage data
              await AsyncStorage.clear();

              // Sign out and redirect to onboarding
              await signOut();
              router.replace("/(onboarding)");
            } catch (error) {
              console.error("Error clearing data:", error);
              Alert.alert(
                "Error",
                "Failed to clear all data. Please try again."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <User size={40} color={colors.primary} />
        </View>
        <Text style={styles.username}>Ideascape User</Text>
        <Text style={styles.userDescription}>
          Organize your ideas and track your progress
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{boards.length}</Text>
          <Text style={styles.statLabel}>Boards</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalIdeas}</Text>
          <Text style={styles.statLabel}>Ideas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedIdeas}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Ideas</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      totalIdeas > 0
                        ? (ideas.filter((i) => i.status === "idea").length /
                            totalIdeas) *
                          100
                        : 0
                    }%`,
                    backgroundColor: colors.statusColors.idea,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressValue}>
              {ideas.filter((i) => i.status === "idea").length}
            </Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>In Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      totalIdeas > 0 ? (inProgressIdeas / totalIdeas) * 100 : 0
                    }%`,
                    backgroundColor: colors.statusColors.inProgress,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressValue}>{inProgressIdeas}</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Completed</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      totalIdeas > 0 ? (completedIdeas / totalIdeas) * 100 : 0
                    }%`,
                    backgroundColor: colors.statusColors.completed,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressValue}>{completedIdeas}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem}>
            <Settings size={20} color={colors.primary} />
            <Text style={styles.menuText}>App Settings</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <HelpCircle size={20} color={colors.primary} />
            <Text style={styles.menuText}>Help & Support</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.menuText}>About Ideascape</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleSignOut}>
            <LogOut size={20} color={colors.primary} />
            <Text style={styles.menuText}>Sign Out</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleClearData}>
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.menuText, { color: colors.error }]}>
              Clear All Data
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.versionText}>Ideascape v1.0.0</Text>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  userDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: colors.border,
    alignSelf: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    width: 100,
    fontSize: 14,
    color: colors.text,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressValue: {
    width: 30,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
});
