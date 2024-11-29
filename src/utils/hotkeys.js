import JSConfetti from 'js-confetti';
const { ipcRenderer } = require('electron');

let jsConfetti = new JSConfetti();
let displayConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  scaleFactor: 1
};

const ANIMATION_DURATION = 4000;
let animationTimer = null; // 添加计时器管理

// 监听显示器变化
ipcRenderer.on('display-changed', (event, newConfig) => {
  displayConfig = newConfig;
  // 新初始化 confetti 实例以适应新的显示器
  jsConfetti = new JSConfetti();
});

export const triggerAnimation = async (type) => {
    const isSuccess = type === 'success';
    
    // 清除之前的计时器
    if (animationTimer) {
        clearTimeout(animationTimer);
    }
    
    // 确保每次都创建新的 JSConfetti 实例
    jsConfetti = new JSConfetti();
    
    const baseConfettiNumber = Math.floor((displayConfig.width * displayConfig.height) / 10000);
    
    jsConfetti.addConfetti({
        confettiColors: isSuccess 
            ? ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB']
            : ['#808080', '#A9A9A9', '#696969'],
        confettiNumber: isSuccess ? baseConfettiNumber * 2 : baseConfettiNumber,
        confettiRadius: 6 * displayConfig.scaleFactor,
        zIndex: 999999
    });

    return isSuccess;
};

let onAnimationTriggered = null;

export const registerHotkeys = (callback) => {
    onAnimationTriggered = callback;
    
    ipcRenderer.removeAllListeners('trigger-animation');
    
    ipcRenderer.on('trigger-animation', async (event, type) => {
        window.console.log(`触发${type === 'success' ? '胜利' : '失败'}动画`);
        const isVictory = await triggerAnimation(type);
        onAnimationTriggered?.(isVictory);
        
        // 使用计时器变量管理动画结束
        animationTimer = setTimeout(() => {
            ipcRenderer.send('animation-complete');
            animationTimer = null;
        }, ANIMATION_DURATION);
    });

    const handler = async (event) => {
        if ((event.altKey || event.metaKey) && event.key.toLowerCase() === 'v') {
            const isVictory = await triggerAnimation('success');
            onAnimationTriggered?.(isVictory);
            animationTimer = setTimeout(() => {
                ipcRenderer.send('animation-complete');
                animationTimer = null;
            }, ANIMATION_DURATION);
        } else if ((event.altKey || event.metaKey) && event.key.toLowerCase() === 'f') {
            const isVictory = await triggerAnimation('failure');
            onAnimationTriggered?.(isVictory);
            animationTimer = setTimeout(() => {
                ipcRenderer.send('animation-complete');
                animationTimer = null;
            }, ANIMATION_DURATION);
        }
    };

    document.addEventListener('keydown', handler);
    return () => {
        if (animationTimer) {
            clearTimeout(animationTimer);
        }
        document.removeEventListener('keydown', handler);
        ipcRenderer.removeAllListeners('trigger-animation');
    };
};