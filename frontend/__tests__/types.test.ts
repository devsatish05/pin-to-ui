import { Comment, CommentStatus, CommentPriority, CommentCategory } from '../shared/types';

describe('Types', () => {
  describe('Comment Interface', () => {
    it('should create a valid comment object', () => {
      const comment: Comment = {
        id: 1,
        pageUrl: 'http://localhost:5173/',
        content: 'Test comment',
        positionX: 100,
        positionY: 200,
        status: CommentStatus.OPEN,
        priority: CommentPriority.MEDIUM,
        category: CommentCategory.BUG,
        authorName: 'Test User',
        authorEmail: 'test@example.com',
        createdAt: new Date().toISOString(),
      };

      expect(comment.id).toBe(1);
      expect(comment.content).toBe('Test comment');
      expect(comment.positionX).toBe(100);
      expect(comment.positionY).toBe(200);
    });

    it('should allow optional fields to be undefined', () => {
      const comment: Comment = {
        pageUrl: 'http://localhost:5173/',
        content: 'Minimal comment',
        positionX: 50,
        positionY: 75,
      };

      expect(comment.id).toBeUndefined();
      expect(comment.status).toBeUndefined();
      expect(comment.priority).toBeUndefined();
      expect(comment.authorName).toBeUndefined();
    });
  });

  describe('CommentStatus Enum', () => {
    it('should have correct status values', () => {
      expect(CommentStatus.OPEN).toBe('OPEN');
      expect(CommentStatus.IN_PROGRESS).toBe('IN_PROGRESS');
      expect(CommentStatus.RESOLVED).toBe('RESOLVED');
      expect(CommentStatus.CLOSED).toBe('CLOSED');
    });
  });

  describe('CommentPriority Enum', () => {
    it('should have correct priority values', () => {
      expect(CommentPriority.LOW).toBe('LOW');
      expect(CommentPriority.MEDIUM).toBe('MEDIUM');
      expect(CommentPriority.HIGH).toBe('HIGH');
      expect(CommentPriority.CRITICAL).toBe('CRITICAL');
    });
  });

  describe('CommentCategory Enum', () => {
    it('should have correct category values', () => {
      expect(CommentCategory.BUG).toBe('BUG');
      expect(CommentCategory.FEATURE).toBe('FEATURE');
      expect(CommentCategory.IMPROVEMENT).toBe('IMPROVEMENT');
      expect(CommentCategory.QUESTION).toBe('QUESTION');
      expect(CommentCategory.GENERAL).toBe('GENERAL');
    });
  });
});
