import { Board, Idea, Milestone, Status, Tag } from "@/types";
import { generateId } from "@/utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BoardState {
  boards: Board[];
  ideas: Idea[];
  addBoard: (title: string, description: string) => Board;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  addIdea: (boardId: string, title: string, description: string) => Idea;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  addMilestone: (ideaId: string, title: string) => void;
  toggleMilestone: (ideaId: string, milestoneId: string) => void;
  deleteMilestone: (ideaId: string, milestoneId: string) => void;
  addTag: (ideaId: string, name: string, color: string) => void;
  removeTag: (ideaId: string, tagId: string) => void;
  addImageToIdea: (ideaId: string, imageUrl: string) => void;
  removeImageFromIdea: (ideaId: string, imageUrl: string) => void;
  updateIdeaStatus: (ideaId: string, status: Status) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      ideas: [],

      addBoard: (title, description) => {
        const timestamp = new Date().toISOString();
        const newBoard: Board = {
          id: generateId(),
          title,
          description,
          collaborators: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
        }));

        return newBoard;
      },

      updateBoard: (id, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, ...updates, updatedAt: new Date().toISOString() }
              : board
          ),
        }));
      },

      deleteBoard: (id) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          ideas: state.ideas.filter((idea) => idea.boardId !== id),
        }));
      },

      addIdea: (boardId, title, description) => {
        const timestamp = new Date().toISOString();
        const newIdea: Idea = {
          id: generateId(),
          boardId,
          title,
          description,
          status: "idea",
          tags: [],
          imageUrls: [],
          milestones: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          ideas: [...state.ideas, newIdea],
        }));

        return newIdea;
      },

      updateIdea: (id, updates) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
              : idea
          ),
        }));
      },

      deleteIdea: (id) => {
        set((state) => ({
          ideas: state.ideas.filter((idea) => idea.id !== id),
        }));
      },

      addMilestone: (ideaId, title) => {
        const newMilestone: Milestone = {
          id: generateId(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  milestones: [...idea.milestones, newMilestone],
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      toggleMilestone: (ideaId, milestoneId) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  milestones: idea.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, completed: !milestone.completed }
                      : milestone
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      deleteMilestone: (ideaId, milestoneId) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  milestones: idea.milestones.filter(
                    (milestone) => milestone.id !== milestoneId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      addTag: (ideaId, name, color) => {
        const newTag: Tag = {
          id: generateId(),
          name,
          color,
        };

        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  tags: [...idea.tags, newTag],
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      removeTag: (ideaId, tagId) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  tags: idea.tags.filter((tag) => tag.id !== tagId),
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      addImageToIdea: (ideaId, imageUrl) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  imageUrls: [...idea.imageUrls, imageUrl],
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      removeImageFromIdea: (ideaId, imageUrl) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  imageUrls: idea.imageUrls.filter((url) => url !== imageUrl),
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },

      updateIdeaStatus: (ideaId, status) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId
              ? {
                  ...idea,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : idea
          ),
        }));
      },
    }),
    {
      name: "board-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        console.log("State hydrated from storage");
        return (state) => {
          if (state) {
            console.log("Hydrated state:", state);
          } else {
            console.log("Failed to hydrate state");
          }
        };
      },
    }
  )
);
