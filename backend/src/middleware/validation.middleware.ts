import { body } from 'express-validator';

export const validateComment = [
  body('pageUrl').isString().notEmpty().withMessage('Page URL is required'),
  body('xPosition').isFloat({ min: 0 }).withMessage('X position must be a positive number'),
  body('yPosition').isFloat({ min: 0 }).withMessage('Y position must be a positive number'),
  body('userName').isString().notEmpty().withMessage('User name is required'),
  body('userEmail').isEmail().withMessage('Valid email is required'),
  body('commentText').isString().notEmpty().withMessage('Comment text is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
];

export const validateCommentUpdate = [
  body('commentText').optional().isString().notEmpty().withMessage('Comment text cannot be empty'),
  body('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).withMessage('Invalid status'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
];
