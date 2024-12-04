import { ipcRenderer } from 'electron';
import { animationManager } from '../animations';

let animationTimer = null;
const ANIMATION_DURATION = 3000;

// Register global hotkey event handlers
export const registerHotkeys = (callback) => {
  const onAnimationTriggered = callback;

  // Listen for animation trigger events
  ipcRenderer.on('trigger-animation', async (event, type) => {
    if (animationTimer) {
      clearTimeout(animationTimer);
    }

    window.console.log(`Triggered ${type === 'success' ? 'victory' : 'failure'} animation`);
    
    const currentScheme = animationManager.getCurrentScheme();
    if (currentScheme) {
      try {
        if (type === 'success') {
          await currentScheme.playSuccessAnimation();
        } else {
          await currentScheme.playFailureAnimation();
        }
        onAnimationTriggered?.(type === 'success');
      } catch (error) {
        window.console.error('Animation playback failed:', error);
      }
    }

    animationTimer = setTimeout(() => {
      ipcRenderer.send('animation-complete');
      animationTimer = null;
    }, ANIMATION_DURATION);
  });

  // Listen for animation scheme switch events
  ipcRenderer.on('switch-animation-scheme', (event, schemeId) => {
    const scheme = animationManager.switchScheme(schemeId);
    if (scheme) {
      window.console.log(`Switched to animation scheme: ${scheme.name}`);
    } else {
      window.console.warn(`Animation scheme ${schemeId} does not exist`);
    }
  });

  // Cleanup logic
  window.addEventListener('beforeunload', () => {
    if (animationTimer) {
      clearTimeout(animationTimer);
    }
    const currentScheme = animationManager.getCurrentScheme();
    if (currentScheme) {
      currentScheme.cleanup();
    }
  });
};