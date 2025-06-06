// Generate a random ID
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Format date to a readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate progress percentage based on completed milestones
export const calculateProgress = (
  completedCount: number,
  totalCount: number
): number => {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
};

// Get status display text
export const getStatusText = (status: string): string => {
  switch (status) {
    case "idea":
      return "Idea";
    case "inProgress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
};
