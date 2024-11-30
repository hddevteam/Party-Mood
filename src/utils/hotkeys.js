import { ipcRenderer } from 'electron';
import { animationManager } from '../animations';

let animationTimer = null;
const ANIMATION_DURATION = 3000;

// 注册全局热键事件处理
export const registerHotkeys = (callback) => {
  const onAnimationTriggered = callback;

  // 监听动画触发事件
  ipcRenderer.on('trigger-animation', async (event, type) => {
    if (animationTimer) {
      clearTimeout(animationTimer);
    }

    window.console.log(`触发${type === 'success' ? '胜利' : '失败'}动画`);
    
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
        window.console.error('动画播放失败:', error);
      }
    }

    animationTimer = setTimeout(() => {
      ipcRenderer.send('animation-complete');
      animationTimer = null;
    }, ANIMATION_DURATION);
  });

  // 监听动画方案切换事件
  ipcRenderer.on('switch-animation-scheme', (event, schemeId) => {
    const scheme = animationManager.switchScheme(schemeId);
    if (scheme) {
      window.console.log(`切换到动画方案: ${scheme.name}`);
    } else {
      window.console.warn(`动画方案 ${schemeId} 不存在`);
    }
  });

  // 清理逻辑
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