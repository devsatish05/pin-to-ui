// Component for displaying comment list
export class CommentList {
  private container: HTMLElement;

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container with id ${containerId} not found`);
    }
    this.container = element;
  }

  render(comments: any[]): void {
    this.container.innerHTML = '';

    if (comments.length === 0) {
      this.container.innerHTML = '<p class="no-comments">No comments yet</p>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'comment-list';

    comments.forEach((comment) => {
      const item = this.createCommentItem(comment);
      list.appendChild(item);
    });

    this.container.appendChild(list);
  }

  private createCommentItem(comment: any): HTMLElement {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${comment.authorName || 'Anonymous'}</span>
        <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="comment-content">${comment.content}</div>
      <div class="comment-footer">
        <span class="comment-status">${comment.status}</span>
        <span class="comment-priority">${comment.priority}</span>
      </div>
    `;
    return item;
  }
}
