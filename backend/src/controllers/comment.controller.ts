import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service.js';
import { validationResult } from 'express-validator';

export const getCommentsByPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageUrl } = req.query;
    
    if (!pageUrl || typeof pageUrl !== 'string') {
      res.status(400).json({ error: 'pageUrl query parameter is required' });
      return;
    }

    const comments = await commentService.getCommentsByPage(pageUrl);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid comment ID' });
      return;
    }

    const comment = await commentService.getCommentById(id);
    
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid comment ID' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const comment = await commentService.updateComment(id, req.body);
    
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid comment ID' });
      return;
    }

    await commentService.deleteComment(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
