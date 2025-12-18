// Shared type definitions
export interface Comment {
  id?: number;
  pageUrl: string;
  content: string;
  positionX: number;
  positionY: number;
  screenshotUrl?: string;
  status?: CommentStatus;
  priority?: CommentPriority;
  authorName?: string;
  authorEmail?: string;
  category?: CommentCategory;
  createdAt?: string;
  updatedAt?: string;
  resolution?: string;
  assignedTo?: string;
}

export enum CommentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum CommentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum CommentCategory {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  IMPROVEMENT = 'IMPROVEMENT',
  QUESTION = 'QUESTION',
  GENERAL = 'GENERAL',
}

export interface CommentPin {
  id: string;
  position: Position;
  comment: Comment;
}

export interface Position {
  x: number;
  y: number;
}

export interface OverlayConfig {
  apiBaseUrl: string;
  enableDebug?: boolean;
  theme?: 'light' | 'dark';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
