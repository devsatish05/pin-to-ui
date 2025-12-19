import axios from 'axios';
import ApiClient from '../shared/api-client';
import { Comment, CommentStatus, CommentPriority } from '../shared/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiClient', () => {
  const baseURL = 'http://localhost:8080';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      const mockComment: Comment = {
        pageUrl: 'http://localhost:5173/',
        content: 'Test comment',
        positionX: 100,
        positionY: 200,
        status: CommentStatus.OPEN,
        priority: CommentPriority.MEDIUM,
      };

      const mockResponse = {
        data: { ...mockComment, id: 1, createdAt: new Date().toISOString() },
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const client = new ApiClient(baseURL);
      const result = await client.createComment(mockComment);

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getAllComments', () => {
    it('should fetch all comments', async () => {
      const mockComments: Comment[] = [
        {
          id: 1,
          pageUrl: 'http://localhost:5173/',
          content: 'Test 1',
          positionX: 100,
          positionY: 200,
        },
        {
          id: 2,
          pageUrl: 'http://localhost:5173/',
          content: 'Test 2',
          positionX: 150,
          positionY: 250,
        },
      ];

      const mockResponse = { data: mockComments };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const client = new ApiClient(baseURL);
      const result = await client.getAllComments();

      expect(result).toEqual(mockComments);
      expect(result.length).toBe(2);
    });
  });

  describe('getCommentById', () => {
    it('should fetch a comment by id', async () => {
      const mockComment: Comment = {
        id: 1,
        pageUrl: 'http://localhost:5173/',
        content: 'Test comment',
        positionX: 100,
        positionY: 200,
      };

      const mockResponse = { data: mockComment };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const client = new ApiClient(baseURL);
      const result = await client.getCommentById(1);

      expect(result).toEqual(mockComment);
      expect(result.id).toBe(1);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updates = { status: CommentStatus.RESOLVED, priority: CommentPriority.HIGH };
      const mockResponse = {
        data: { id: 1, ...updates },
      };

      mockedAxios.create.mockReturnValue({
        put: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const client = new ApiClient(baseURL);
      const result = await client.updateComment(1, updates);

      expect(result.status).toBe(CommentStatus.RESOLVED);
      expect(result.priority).toBe(CommentPriority.HIGH);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      mockedAxios.create.mockReturnValue({
        delete: jest.fn().mockResolvedValue({}),
      } as any);

      const client = new ApiClient(baseURL);
      await expect(client.deleteComment(1)).resolves.not.toThrow();
    });
  });

  describe('getCommentsByPageUrl', () => {
    it('should fetch comments by page URL', async () => {
      const mockComments: Comment[] = [
        {
          id: 1,
          pageUrl: 'http://localhost:5173/page1',
          content: 'Test',
          positionX: 100,
          positionY: 200,
        },
      ];

      const mockResponse = { data: mockComments };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const client = new ApiClient(baseURL);
      const result = await client.getCommentsByPageUrl('http://localhost:5173/page1');

      expect(result).toEqual(mockComments);
      expect(result[0].pageUrl).toBe('http://localhost:5173/page1');
    });
  });

  describe('getCommentsByStatus', () => {
    it('should fetch comments by status', async () => {
      const mockComments: Comment[] = [
        {
          id: 1,
          pageUrl: 'http://localhost:5173/',
          content: 'Test',
          positionX: 100,
          positionY: 200,
          status: CommentStatus.OPEN,
        },
      ];

      const mockResponse = { data: mockComments };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const client = new ApiClient(baseURL);
      const result = await client.getCommentsByStatus(CommentStatus.OPEN);

      expect(result).toEqual(mockComments);
      expect(result[0].status).toBe(CommentStatus.OPEN);
    });
  });
});
