import { UICommentOverlay } from '../overlay/overlay';
import { OverlayConfig } from '../shared/types';
import './styles.scss';

// Get configuration from environment variables
const config: OverlayConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  theme: 'light',
  position: 'bottom-right',
};

// Initialize the overlay
const overlay = new UICommentOverlay(config);

// Export for external usage
export { UICommentOverlay, OverlayConfig };
export default overlay;

// Log initialization
console.log('UI Comment Overlay initialized');
