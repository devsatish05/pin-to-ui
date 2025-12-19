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
    
    // Temporarily append to get dimensions
    this.modalElement.style.visibility = 'hidden';
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

    // Adjust position to prevent overflow
    this.adjustModalPosition(position);
    this.modalElement.style.visibility = 'visible';

    const closeBtn = this.modalElement.querySelector('.close-btn');
    const cancelBtn = this.modalElement.querySelector('.btn-cancel');
    const submitBtn = this.modalElement.querySelector('.btn-submit');

    closeBtn?.addEventListener('click', () => this.closeModal());
    cancelBtn?.addEventListener('click', () => this.closeModal());
    submitBtn?.addEventListener('click', () => this.submitComment(position));
  }

  private adjustModalPosition(clickPosition: Position): void {
    if (!this.modalElement) return;

    const modal = this.modalElement;
    const modalRect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    const padding = 16; // Safe padding from edges

    let x = clickPosition.x;
    let y = clickPosition.y;

    // Default: modal above the click point
    let transformX = '-50%';
    let transformY = 'calc(-100% - 16px)';

    // Check horizontal overflow
    const modalHalfWidth = modalRect.width / 2;
    if (x - modalHalfWidth < scrollX + padding) {
      // Too close to left edge
      x = scrollX + padding + modalHalfWidth;
    } else if (x + modalHalfWidth > scrollX + viewportWidth - padding) {
      // Too close to right edge
      x = scrollX + viewportWidth - padding - modalHalfWidth;
    }

    // Check vertical overflow
    const modalHeight = modalRect.height;
    if (y - modalHeight - 16 < scrollY + padding) {
      // Not enough space above, position below
      transformY = '16px';
      
      // Check if there's space below
      if (y + modalHeight + 16 > scrollY + viewportHeight - padding) {
        // No space above or below, center vertically
        y = scrollY + viewportHeight / 2;
        transformY = '-50%';
      }
    }

    modal.style.left = `${x}px`;
    modal.style.top = `${y}px`;
    modal.style.transform = `translate(${transformX}, ${transformY})`;
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
    this.closeModal();

    this.modalElement = document.createElement('div');
    this.modalElement.className = 'ui-comment-modal ui-comment-details';
    this.modalElement.style.left = `${pin.position.x}px`;
    this.modalElement.style.top = `${pin.position.y}px`;

    const statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    this.modalElement.innerHTML = `
      <div class="modal-header">
        <h3>Comment Details</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="comment-detail">
          <label>Comment:</label>
          <p>${pin.comment.content}</p>
        </div>
        <div class="comment-detail">
          <label>Author:</label>
          <p>${pin.comment.authorName || 'Anonymous'}</p>
        </div>
        ${pin.comment.authorEmail ? `
        <div class="comment-detail">
          <label>Email:</label>
          <p>${pin.comment.authorEmail}</p>
        </div>` : ''}
        <div class="comment-detail">
          <label>Category:</label>
          <p>${pin.comment.category || 'GENERAL'}</p>
        </div>
        <div class="comment-detail">
          <label>Priority:</label>
          <select id="update-priority" class="priority-select">
            ${priorityOptions.map(p => `<option value="${p}" ${pin.comment.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="comment-detail">
          <label>Status:</label>
          <select id="update-status" class="status-select">
            ${statusOptions.map(s => `<option value="${s}" ${pin.comment.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="comment-detail">
          <label>Created:</label>
          <p>${pin.comment.createdAt ? new Date(pin.comment.createdAt).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-delete" style="background-color: #dc3545;">Delete Pin</button>
        <button class="btn-update" style="background-color: #28a745;">Update</button>
        <button class="btn-cancel">Close</button>
      </div>
    `;

    document.body.appendChild(this.modalElement);
    this.adjustModalPosition(pin.position);
    this.modalElement.style.visibility = 'visible';

    const closeBtn = this.modalElement.querySelector('.close-btn');
    const cancelBtn = this.modalElement.querySelector('.btn-cancel');
    const updateBtn = this.modalElement.querySelector('.btn-update');
    const deleteBtn = this.modalElement.querySelector('.btn-delete');

    closeBtn?.addEventListener('click', () => this.closeModal());
    cancelBtn?.addEventListener('click', () => this.closeModal());
    updateBtn?.addEventListener('click', () => this.updatePin(pin));
    deleteBtn?.addEventListener('click', () => this.deletePin(pin));
  }

  private async updatePin(pin: CommentPin): Promise<void> {
    if (!pin.comment.id) {
      alert('Cannot update comment without ID');
      return;
    }

    const statusSelect = document.getElementById('update-status') as HTMLSelectElement;
    const prioritySelect = document.getElementById('update-priority') as HTMLSelectElement;

    const updates = {
      status: statusSelect?.value,
      priority: prioritySelect?.value,
    };

    try {
      if (this.standaloneMode) {
        // Update in localStorage
        this.updateInLocalStorage(pin.comment.id, updates);
        pin.comment.status = updates.status as any;
        pin.comment.priority = updates.priority as any;
        this.log('Comment updated locally (standalone mode)');
      } else {
        // Update on backend
        const updatedComment = await this.apiClient.updateComment(pin.comment.id, updates);
        pin.comment = updatedComment;
        this.log('Comment updated on server:', updatedComment);
      }

      this.closeModal();
      
      // Update pin appearance if status is RESOLVED or CLOSED
      if (updates.status === 'RESOLVED' || updates.status === 'CLOSED') {
        this.updatePinAppearance(pin);
      }
      
      alert('Comment updated successfully!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  }

  private async deletePin(pin: CommentPin): Promise<void> {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    if (!pin.comment.id) {
      alert('Cannot delete comment without ID');
      return;
    }

    try {
      if (this.standaloneMode) {
        // Delete from localStorage
        this.deleteFromLocalStorage(pin.comment.id);
        this.log('Comment deleted locally (standalone mode)');
      } else {
        // Delete from backend
        await this.apiClient.deleteComment(pin.comment.id);
        this.log('Comment deleted from server');
      }

      // Remove from pins array
      const index = this.pins.findIndex(p => p.id === pin.id);
      if (index > -1) {
        this.pins.splice(index, 1);
      }

      // Remove pin element from DOM
      document.querySelectorAll('.ui-comment-pin').forEach((element) => {
        const pinEl = element as HTMLElement;
        if (pinEl.style.left === `${pin.position.x}px` && pinEl.style.top === `${pin.position.y}px`) {
          pinEl.remove();
        }
      });

      this.closeModal();
      alert('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }

  private updatePinAppearance(pin: CommentPin): void {
    document.querySelectorAll('.ui-comment-pin').forEach((element) => {
      const pinEl = element as HTMLElement;
      if (pinEl.style.left === `${pin.position.x}px` && pinEl.style.top === `${pin.position.y}px`) {
        if (pin.comment.status === 'RESOLVED' || pin.comment.status === 'CLOSED') {
          pinEl.style.opacity = '0.5';
          pinEl.style.filter = 'grayscale(100%)';
          pinEl.title = `${pin.comment.content} (${pin.comment.status})`;
        }
      }
    });
  }

  private updateInLocalStorage(id: number, updates: any): void {
    const key = `ui-comments-${window.location.href}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const comments = JSON.parse(existing);
      const index = comments.findIndex((c: Comment) => c.id === id);
      if (index > -1) {
        comments[index] = { ...comments[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify(comments));
      }
    }
  }

  private deleteFromLocalStorage(id: number): void {
    const key = `ui-comments-${window.location.href}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const comments = JSON.parse(existing);
      const filtered = comments.filter((c: Comment) => c.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
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
