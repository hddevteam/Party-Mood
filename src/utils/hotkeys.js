import JSConfetti from 'js-confetti';
const { ipcRenderer } = require('electron');

let jsConfetti = new JSConfetti();
let displayConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  scaleFactor: 1
};

// 监听显示器变化
ipcRenderer.on('display-changed', (event, newConfig) => {
  displayConfig = newConfig;
  // ���新初始化 confetti 实例以适应新的显示器
  jsConfetti = new JSConfetti();
});

export const triggerAnimation = (type) => {
    // 根据显示器大小调整配置
    const baseConfettiNumber = Math.floor((displayConfig.width * displayConfig.height) / 10000);
    
    const confettiConfig = {
        ...type === 'success' 
            ? {
                confettiColors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'],
                confettiNumber: baseConfettiNumber * 2, // 动态计算粒子数量
                confettiRadius: 6 * displayConfig.scaleFactor // 根据缩放因子调整大小
              }
            : {
                confettiColors: ['#808080', '#A9A9A9', '#696969'],
                confettiNumber: baseConfettiNumber,
                confettiRadius: 6 * displayConfig.scaleFactor
              },
        zIndex: 999999  // 确保特效显示在最上层
    };
    
    jsConfetti.addConfetti(confettiConfig);
    return type === 'success';
};

let onAnimationTriggered = null;

export const registerHotkeys = (callback) => {
    onAnimationTriggered = callback;
    
    // 监听来自主进程的消息
    ipcRenderer.on('trigger-animation', (event, type) => {
        const isVictory = triggerAnimation(type);
        onAnimationTriggered?.(isVictory);
    });

    // 保留原有的键盘事件监听
    const handler = (event) => {
        if ((event.altKey || event.metaKey) && event.key.toLowerCase() === 'v') {
            const isVictory = triggerAnimation('success');
            onAnimationTriggered?.(isVictory);
        } else if ((event.altKey || event.metaKey) && event.key.toLowerCase() === 'f') {
            const isVictory = triggerAnimation('failure');
            onAnimationTriggered?.(isVictory);
        }
    };

    document.addEventListener('keydown', handler);
    return () => {
        document.removeEventListener('keydown', handler);
        ipcRenderer.removeAllListeners('trigger-animation');
    };
};