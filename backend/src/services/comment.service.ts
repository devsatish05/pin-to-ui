import { PrismaClient, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCommentDto {
  pageUrl: string;
  xPosition: number;
  yPosition: number;
  userName: string;
  userEmail: string;
  commentText: string;
  priority?: string;
}

export interface UpdateCommentDto {
  commentText?: string;
  status?: string;
  priority?: string;
}

export const getCommentsByPage = async (pageUrl: string): Promise<Comment[]> => {
  return prisma.comment.findMany({
    where: { pageUrl },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCommentById = async (id: number): Promise<Comment | null> => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

export const createComment = async (data: CreateCommentDto): Promise<Comment> => {
  return prisma.comment.create({
    data: {
      pageUrl: data.pageUrl,
      xPosition: data.xPosition,
      yPosition: data.yPosition,
      userName: data.userName,
      userEmail: data.userEmail,
      commentText: data.commentText,
      priority: data.priority || 'MEDIUM',
      status: 'OPEN',
    },
  });
};

export const updateComment = async (
  id: number,
  data: UpdateCommentDto
): Promise<Comment | null> => {
  try {
    return await prisma.comment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
};

export const deleteComment = async (id: number): Promise<void> => {
  await prisma.comment.delete({
    where: { id },
  });
};
