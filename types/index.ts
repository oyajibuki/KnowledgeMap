export type NodeStatus = "locked" | "viewed" | "mastered";

export interface KnowledgeNode {
  id: string;
  topicId: string;
  title: string;
  description: string;
  detail: string;
  difficulty: number;
  importance: number;
  isExamFrequent: boolean;
  status: NodeStatus;
  position: { x: number; y: number };
  wikiUrl?: string;
}

export interface Connection {
  fromNodeId: string;
  toNodeId: string;
  relationType: "related" | "dependency";
}

export interface Question {
  id: string;
  nodeId: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface Topic {
  id: string;
  subCategoryId: string;
  name: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}
