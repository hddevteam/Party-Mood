import anime from 'animejs';
import { AnimationScheme } from '../animationScheme.js';
import { SoundManager } from '../../utils/soundManager.js';

export class SpiralEmojiFountainScheme extends AnimationScheme {
    constructor() {
        super('spiralEmojiFountain');
        this.soundManager = new SoundManager();
        this.animations = [];
        this.emojiSets = {
            success: [
                ['🌟', '✨', '💫', '⭐'],  // 星星系列
                ['🎉', '🎊', '🎈', '🎆'],  // 庆祝系列
                ['🌸', '🌺', '🌹', '🌷'],  // 花朵系列
                ['💝', '💖', '💗', '💓'],  // 心形系列
                ['🔥', '✨', '💫', '⚡'],  // 光效系列
            ],
            failure: [
                ['💨', '🌫', '🕸', '🍂'],  // 消散系列
                ['💭', '🌧', '⛈', '🌩'],  // 阴天系列
                ['😶', '😔', '😕', '😢'],  // 悲伤系列
                ['🌑', '☁️', '🌫', '🌧'],  // 阴暗系列
                ['💔', '💢', '❌', '⛔']   // 否定系列
            ]
        };
        this.lastSuccessIndex = -1;  // 添加索引追踪
        this.lastFailureIndex = -1;  // 添加索引追踪
    }

    // 添加获取随机emoji组合的方法
    getRandomEmojiSet(type) {
        const sets = this.emojiSets[type];
        let index;
        
        // 确保不会连续使用相同的组合
        do {
            index = Math.floor(Math.random() * sets.length);
        } while (index === (type === 'success' ? this.lastSuccessIndex : this.lastFailureIndex));
        
        if (type === 'success') {
            this.lastSuccessIndex = index;
        } else {
            this.lastFailureIndex = index;
        }
        
        return sets[index];
    }

    createEmoji(emoji, isSuccess) {
        const element = document.createElement('div');
        const size = 30 + Math.random() * 20;
        
        element.style.cssText = `
            position: fixed;
            font-size: ${size}px;
            user-select: none;
            pointer-events: none;
            z-index: ${this.zIndex};
            transform-origin: center;
            opacity: 0;
            filter: drop-shadow(0 0 8px ${isSuccess ? '#FFD700' : '#696969'});
            will-change: transform, opacity;
        `;
        element.textContent = emoji;
        return element;
    }

    async playSuccessAnimation() {
        this.setupContainer();
        const duration = 2500;
        const emojisCount = 25;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const emojiSet = this.getRandomEmojiSet('success');
        this.soundManager.playSound('success');

        for (let i = 0; i < emojisCount; i++) {
            const emoji = this.createEmoji(emojiSet[i % emojiSet.length], true);
            this.container.appendChild(emoji);

            // 设置初始位置在屏幕中央
            emoji.style.left = `${centerX}px`;
            emoji.style.top = `${centerY}px`;

            const angle = (i / emojisCount) * Math.PI * 8; // 8圈螺旋
            const radius = (i / emojisCount) * Math.min(window.innerWidth, window.innerHeight) * 0.4;

            const animation = anime({
                targets: emoji,
                translateX: [
                    { value: Math.cos(angle) * radius, duration: duration }
                ],
                translateY: [
                    { value: Math.sin(angle) * radius, duration: duration }
                ],
                rotate: [
                    { value: angle * 180 / Math.PI, duration: duration }
                ],
                scale: [
                    { value: 0, duration: 0 },
                    { value: 1, duration: duration * 0.3 },
                    { value: 0, duration: duration * 0.7 }
                ],
                opacity: [
                    { value: 0, duration: 0 },
                    { value: 1, duration: duration * 0.3 },
                    { value: 0, duration: duration * 0.7 }
                ],
                delay: i * 50,
                easing: 'easeOutExpo'
            });

            this.animations.push(animation);
        }

        // 设置动画清理定时器
        this.scheduleCleanup(duration + emojisCount * 50 + 500);
    }

    async playFailureAnimation() {
        this.setupContainer();
        const duration = 2500;  // 增加动画持续时间
        const emojisCount = 20;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const emojiSet = this.getRandomEmojiSet('failure');
        this.soundManager.playSound('failure');

        for (let i = 0; i < emojisCount; i++) {
            const emoji = this.createEmoji(emojiSet[i % emojiSet.length], false);
            this.container.appendChild(emoji);

            // 在一个小圆环上随机分布初始位置
            const startAngle = (Math.PI * 2 * i / emojisCount) + (Math.random() * 0.5 - 0.25);
            const startRadius = 20 + Math.random() * 30;
            const startX = centerX + Math.cos(startAngle) * startRadius;
            const startY = centerY + Math.sin(startAngle) * startRadius;

            emoji.style.left = `${startX}px`;
            emoji.style.top = `${startY}px`;

            // 计算螺旋路径参数
            const angle = (i / emojisCount) * Math.PI * 3; // 减少螺旋圈数
            const radius = (i / emojisCount) * Math.min(window.innerWidth, window.innerHeight) * 0.35;
            
            // 随机化下落距离
            const fallDistance = 300 + Math.random() * 200;

            const animation = anime({
                targets: emoji,
                translateX: [
                    { value: 0, duration: 0 },
                    { value: Math.cos(angle) * radius * 0.3, duration: duration * 0.3 },
                    { value: Math.cos(angle) * radius, duration: duration * 0.7 }
                ],
                translateY: [
                    { value: 0, duration: 0 },
                    { value: Math.sin(angle) * radius * 0.2, duration: duration * 0.3 },
                    { value: Math.sin(angle) * radius + fallDistance, duration: duration * 0.7 }
                ],
                rotate: [
                    { value: 0, duration: 0 },
                    { value: -angle * 90 / Math.PI, duration: duration }
                ],
                scale: [
                    { value: 0, duration: 0 },
                    { value: 1.2, duration: duration * 0.2 },
                    { value: 0.8, duration: duration * 0.3 },
                    { value: 0, duration: duration * 0.5 }
                ],
                opacity: [
                    { value: 0, duration: 0 },
                    { value: 0.9, duration: duration * 0.2 },
                    { value: 0.7, duration: duration * 0.3 },
                    { value: 0, duration: duration * 0.5 }
                ],
                delay: i * 100,  // 增加延迟时间
                easing: 'easeInOutQuad'  // 使用更平滑的缓动函数
            });

            this.animations.push(animation);
        }

        this.scheduleCleanup(duration + emojisCount * 100 + 500);
    }

    setupContainer() {
        if (this.container) {
            this.cleanup();
        }
        this.container = this.createAnimationContainer();
    }

    cleanup() {
        if (this.cleanupTimer) {
            clearTimeout(this.cleanupTimer);
            this.cleanupTimer = null;
        }

        if (this.container) {
            this.animations.forEach(animation => animation.pause());
            this.animations = [];
            super.cleanup();
        }
    }

    scheduleCleanup(delay) {
        if (this.cleanupTimer) {
            clearTimeout(this.cleanupTimer);
        }
        
        this.cleanupTimer = setTimeout(() => {
            this.cleanup();
            this.cleanupTimer = null;
        }, delay);
    }
}