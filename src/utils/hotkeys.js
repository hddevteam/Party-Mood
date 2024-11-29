import JSConfetti from 'js-confetti';
const { ipcRenderer } = require('electron');

const jsConfetti = new JSConfetti();

export const triggerAnimation = (type) => {
    const confettiConfig = {
        ...type === 'success' 
            ? {
                confettiColors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'],
                confettiNumber: 500
              }
            : {
                confettiColors: ['#808080', '#A9A9A9', '#696969'],
                confettiNumber: 200
              },
        confettiRadius: 6,
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