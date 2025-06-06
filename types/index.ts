export type Status = "idea" | "inProgress" | "completed";

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Idea {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: Status;
  tags: Tag[];
  imageUrls: string[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
}
