import axios, { AxiosInstance } from 'axios';
import { Comment } from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createComment(comment: Comment): Promise<Comment> {
    const response = await this.client.post<Comment>('/comments', comment);
    return response.data;
  }

  async getAllComments(): Promise<Comment[]> {
    const response = await this.client.get<Comment[]>('/comments');
    return response.data;
  }

  async getCommentById(id: number): Promise<Comment> {
    const response = await this.client.get<Comment>(`/comments/${id}`);
    return response.data;
  }

  async getCommentsByPageUrl(url: string): Promise<Comment[]> {
    const response = await this.client.get<Comment[]>('/comments/page', {
      params: { url },
    });
    return response.data;
  }

  async getCommentsByStatus(status: string): Promise<Comment[]> {
    const response = await this.client.get<Comment[]>(`/comments/status/${status}`);
    return response.data;
  }

  async updateComment(id: number, updates: Partial<Comment>): Promise<Comment> {
    const response = await this.client.put<Comment>(`/comments/${id}`, updates);
    return response.data;
  }

  async deleteComment(id: number): Promise<void> {
    await this.client.delete(`/comments/${id}`);
  }
}

export default ApiClient;
