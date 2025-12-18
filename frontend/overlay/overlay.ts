import './overlay.scss';
import { Comment, CommentPin, OverlayConfig, Position } from '../shared/types';
import ApiClient from '../shared/api-client';

export class UICommentOverlay {
  private config: OverlayConfig;
  private apiClient: ApiClient;
  private isActive: boolean = false;
  private pins: CommentPin[] = [];
  private overlayElement: HTMLElement | null = null;
  private modalElement: HTMLElement | null = null;
  private standaloneMode: boolean = false;

  constructor(config: OverlayConfig) {
    this.config = {
      enableDebug: false,
      theme: 'light',
      position: 'bottom-right',
      ...config,
    };
    this.apiClient = new ApiClient(this.config.apiBaseUrl);
    this.init();
  }

  private init(): void {
    this.log('Initializing UI Comment Overlay');
    this.createToggleButton();
    this.checkBackendConnection();
  }

  private async checkBackendConnection(): Promise<void> {
    try {
      await this.loadExistingComments();
      this.standaloneMode = false;
      this.log('Backend connected successfully');
    } catch (error) {
      this.standaloneMode = true;
      this.log('Running in standalone mode (backend not available)');
      console.warn('UI Comment Overlay: Backend not available. Running in demo mode with local storage.');
    }
    this.updateToggleButtonMode();
  }

  private log(message: string, ...args: any[]): void {
    if (this.config.enableDebug) {
      console.log(`[UICommentOverlay] ${message}`, ...args);
    }
  }

  private createToggleButton(): void {
    const button = document.createElement('button');
    button.id = 'ui-comment-toggle';
    button.className = `ui-comment-toggle ${this.config.position}`;
    button.innerHTML = '💬';
    button.title = 'Toggle UI Comments';
    button.addEventListener('click', () => this.toggle());
    document.body.appendChild(button);
  }

  private updateToggleButtonMode(): void {
    const button = document.getElementById('ui-comment-toggle');
    if (button) {
      if (this.standaloneMode) {
        button.classList.add('standalone-mode');
        button.title = 'Toggle UI Comments (Standalone Mode - Using localStorage)';
      } else {
        button.classList.remove('standalone-mode');
        button.title = 'Toggle UI Comments (Connected to Backend)';
      }
    }
  }

  public toggle(): void {
    this.isActive = !this.isActive;
    this.log(`Overlay ${this.isActive ? 'activated' : 'deactivated'}`);

    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  private activate(): void {
    this.createOverlay();
    this.renderPins();
    document.addEventListener('click', this.handleDocumentClick);
  }

  private deactivate(): void {
    this.removeOverlay();
    this.clearPins();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private createOverlay(): void {
    if (this.overlayElement) return;

    this.overlayElement = document.createElement('div');
    this.overlayElement.id = 'ui-comment-overlay';
    this.overlayElement.className = 'ui-comment-overlay';
    document.body.appendChild(this.overlayElement);
  }

  private removeOverlay(): void {
    if (this.overlayElement) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }
  }

  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.isActive) return;

    const target = event.target as HTMLElement;
    if (
      target.closest('.ui-comment-pin') ||
      target.closest('.ui-comment-modal') ||
      target.closest('#ui-comment-toggle')
    ) {
      return;
    }

    const position: Position = {
      x: event.pageX,
      y: event.pageY,
    };

    this.showCommentModal(position);
  };

  private showCommentModal(position: Position): void {
    this.closeModal();

    this.modalElement = document.createElement('div');
    this.modalElement.className = 'ui-comment-modal';
    this.modalElement.style.left = `${position.x}px`;
    this.modalElement.style.top = `${position.y}px`;

    this.modalElement.innerHTML = `
      <div class="modal-header">
        <h3>Add Comment</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <textarea 
          id="comment-content" 
          placeholder="Enter your comment..." 
          rows="4"
        ></textarea>
        <input 
          type="text" 
          id="author-name" 
          placeholder="Your name (optional)"
        />
        <input 
          type="email" 
          id="author-email" 
          placeholder="Your email (optional)"
        />
        <select id="comment-category">
          <option value="GENERAL">General</option>
          <option value="BUG">Bug</option>
          <option value="FEATURE">Feature Request</option>
          <option value="IMPROVEMENT">Improvement</option>
          <option value="QUESTION">Question</option>
        </select>
        <select id="comment-priority">
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel">Cancel</button>
        <button class="btn-submit">Submit</button>
      </div>
    `;

    document.body.appendChild(this.modalElement);

    const closeBtn = this.modalElement.querySelector('.close-btn');
    const cancelBtn = this.modalElement.querySelector('.btn-cancel');
    const submitBtn = this.modalElement.querySelector('.btn-submit');

    closeBtn?.addEventListener('click', () => this.closeModal());
    cancelBtn?.addEventListener('click', () => this.closeModal());
    submitBtn?.addEventListener('click', () => this.submitComment(position));
  }

  private closeModal(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }

  private async submitComment(position: Position): Promise<void> {
    const content = (document.getElementById('comment-content') as HTMLTextAreaElement)?.value;
    const authorName = (document.getElementById('author-name') as HTMLInputElement)?.value;
    const authorEmail = (document.getElementById('author-email') as HTMLInputElement)?.value;
    const category = (document.getElementById('comment-category') as HTMLSelectElement)?.value;
    const priority = (document.getElementById('comment-priority') as HTMLSelectElement)?.value;

    if (!content) {
      alert('Please enter a comment');
      return;
    }

    const comment: Comment = {
      pageUrl: window.location.href,
      content,
      positionX: position.x,
      positionY: position.y,
      authorName: authorName || undefined,
      authorEmail: authorEmail || undefined,
      category: category as any,
      priority: priority as any,
      status: 'OPEN' as any,
    };

    try {
      let savedComment: Comment;
      
      if (this.standaloneMode) {
        // Save to localStorage in standalone mode
        savedComment = {
          ...comment,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.saveToLocalStorage(savedComment);
        this.log('Comment saved locally (standalone mode):', savedComment);
      } else {
        // Save to backend
        savedComment = await this.apiClient.createComment(comment);
        this.log('Comment created on server:', savedComment);
      }
      
      this.addPin(position, savedComment);
      this.closeModal();
    } catch (error) {
      console.error('Failed to create comment:', error);
      // Fallback to localStorage if backend fails
      const savedComment: Comment = {
        ...comment,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.saveToLocalStorage(savedComment);
      this.addPin(position, savedComment);
      this.closeModal();
      console.warn('Backend unavailable. Comment saved locally.');
    }
  }

  private saveToLocalStorage(comment: Comment): void {
    const key = `ui-comments-${window.location.href}`;
    const existing = localStorage.getItem(key);
    const comments = existing ? JSON.parse(existing) : [];
    comments.push(comment);
    localStorage.setItem(key, JSON.stringify(comments));
  }

  private loadFromLocalStorage(): Comment[] {
    const key = `ui-comments-${window.location.href}`;
    const existing = localStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  }

  private addPin(position: Position, comment: Comment): void {
    const pin: CommentPin = {
      id: `pin-${Date.now()}`,
      position,
      comment,
    };

    this.pins.push(pin);
    this.renderPin(pin);
  }

  private renderPins(): void {
    this.clearPins();
    this.pins.forEach((pin) => this.renderPin(pin));
  }

  private renderPin(pin: CommentPin): void {
    const pinElement = document.createElement('div');
    pinElement.className = 'ui-comment-pin';
    pinElement.style.left = `${pin.position.x}px`;
    pinElement.style.top = `${pin.position.y}px`;
    pinElement.innerHTML = '📌';
    pinElement.title = pin.comment.content;

    pinElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPinDetails(pin);
    });

    document.body.appendChild(pinElement);
  }

  private showPinDetails(pin: CommentPin): void {
    alert(`Comment: ${pin.comment.content}\nStatus: ${pin.comment.status}`);
  }

  private clearPins(): void {
    document.querySelectorAll('.ui-comment-pin').forEach((pin) => pin.remove());
  }

  private async loadExistingComments(): Promise<void> {
    try {
      let comments: Comment[];
      
      if (this.standaloneMode) {
        // Load from localStorage in standalone mode
        comments = this.loadFromLocalStorage();
        this.log('Loaded comments from localStorage:', comments);
      } else {
        try {
          // Try to load from backend
          comments = await this.apiClient.getCommentsByPageUrl(window.location.href);
          this.log('Loaded existing comments from server:', comments);
        } catch (error) {
          // Fallback to localStorage if backend fails
          this.standaloneMode = true;
          comments = this.loadFromLocalStorage();
          this.log('Backend unavailable, loaded from localStorage:', comments);
        }
      }

      comments.forEach((comment) => {
        if (comment.positionX && comment.positionY) {
          this.addPin({ x: comment.positionX, y: comment.positionY }, comment);
        }
      });
    } catch (error) {
      console.error('Failed to load existing comments:', error);
    }
  }

  public destroy(): void {
    this.deactivate();
    document.getElementById('ui-comment-toggle')?.remove();
  }
}

export default UICommentOverlay;
