import anime from 'animejs';
import { AnimationScheme } from '../animationScheme.js';
import { SoundManager } from '../../utils/soundManager.js';

export class BouncingEmojiGridScheme extends AnimationScheme {
    constructor() {
        super('bouncingEmojiGrid', true); // 将这个动画方案标记为背景动画
        this.soundManager = new SoundManager();
        this.animations = [];
        this.emojiSets = {
            success: [
                ['🌟', '⭐', '✨', '💫'],  // 星光系列
                ['🎉', '🎊', '🎈', '🎆'],  // 庆祝系列
                ['🦋', '🌺', '🌸', '🌼'],  // 春天系列
                ['💎', '💫', '🌟', '✨'],  // 闪耀系列
                ['🎵', '🎶', '🎸', '🎹']   // 音乐系列
            ],
            failure: [
                ['😢', '😭', '😔', '😞'],  // 悲伤系列
                ['💔', '🌧', '⛈', '🌩'],  // 心碎系列
                ['🍂', '🍁', '🍃', '🌪'],  // 凋零系列
                ['⚡', '❌', '⛔', '📉'],  // 否定系列
                ['🌑', '☁️', '🌫', '💨']   // 阴暗系列
            ]
        };
        this.lastSuccessIndex = -1;
        this.lastFailureIndex = -1;
    }

    getRandomEmojiSet(type) {
        const sets = this.emojiSets[type];
        let index;
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
        element.style.cssText = `
            position: fixed;
            font-size: 50px;
            user-select: none;
            pointer-events: none;
            z-index: ${this.zIndex};
            opacity: 0;
            transform-origin: center bottom;
            filter: drop-shadow(0 0 15px ${isSuccess ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 68, 68, 0.3)'});
        `;
        element.textContent = emoji;
        return element;
    }

    async playSuccessAnimation() {
        this.setupContainer();
        const gridRows = 3;    // 减少行数
        const gridCols = 7;    // 增加列数
        const spacing = {
            x: Math.min(window.innerWidth / 8, 140), // 横向间距随屏幕宽度自适应
            y: 100  // 纵向间距固定
        };
        const duration = 2000;
        const emojiSet = this.getRandomEmojiSet('success');
        
        // 计算起始位置，确保网格居中
        const startX = window.innerWidth / 2 - (spacing.x * (gridCols - 1)) / 2;
        const startY = window.innerHeight / 2 - (spacing.y * (gridRows - 1)) / 2 + 50;

        this.soundManager.playSound('success');

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const emoji = this.createEmoji(
                    emojiSet[Math.floor(Math.random() * emojiSet.length)],
                    true
                );
                this.container.appendChild(emoji);

                const x = startX + col * spacing.x;
                const y = startY + row * spacing.y;
                emoji.style.left = `${x}px`;
                emoji.style.top = `${y}px`;

                // 根据位置计算延迟，使动画从中心向两侧扩散
                const centerCol = (gridCols - 1) / 2;
                const distanceFromCenter = Math.abs(col - centerCol);
                const delay = distanceFromCenter * 80 + row * 100;

                // 计算弹跳参数
                const bounceHeight = -100 - Math.random() * 100; // 随机弹跳高度

                const animation = anime({
                    targets: emoji,
                    translateY: [
                        { value: 200, duration: 0 },
                        { value: bounceHeight, duration: duration * 0.4 },
                        { value: 0, duration: duration * 0.6 }
                    ],
                    scale: [
                        { value: 0, duration: 0 },
                        { value: 1.2, duration: duration * 0.4 },
                        { value: 1, duration: duration * 0.6 }
                    ],
                    opacity: [
                        { value: 0, duration: 0 },
                        { value: 1, duration: duration * 0.2 },
                        { value: 1, duration: duration * 0.6 },
                        { value: 0, duration: duration * 0.2 }
                    ],
                    delay: delay,
                    easing: 'easeOutElastic(1, .5)'
                });

                this.animations.push(animation);
            }
        }

        this.scheduleCleanup(duration + gridRows * gridCols * 100 + 500);
    }

    async playFailureAnimation() {
        this.setupContainer();
        const gridRows = 3;    // 3行
        const gridCols = 5;    // 5列，比成功动画略少
        const spacing = {
            x: Math.min(window.innerWidth / 6, 160), // 横向间距更大
            y: 120  // 纵向间距也略大
        };
        const duration = 2000;
        const emojiSet = this.getRandomEmojiSet('failure');

        // 调整网格位置，使其居中且略微向下
        const startX = window.innerWidth / 2 - (spacing.x * (gridCols - 1)) / 2;
        const startY = window.innerHeight / 2 - (spacing.y * (gridRows - 1)) / 2 + 50;

        this.soundManager.playSound('failure');

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const emoji = this.createEmoji(emojiSet[Math.floor(Math.random() * emojiSet.length)], false);
                this.container.appendChild(emoji);

                // 初始位置随机偏移
                const randomOffsetX = (Math.random() - 0.5) * 40;
                const randomOffsetY = (Math.random() - 0.5) * 30;
                const x = startX + col * spacing.x + randomOffsetX;
                const y = startY + row * spacing.y + randomOffsetY;
                
                emoji.style.left = `${x}px`;
                emoji.style.top = `${y}px`;

                // 从中心向外的延迟
                const centerCol = (gridCols - 1) / 2;
                const distanceFromCenter = Math.abs(col - centerCol);
                const delay = distanceFromCenter * 100 + row * 120;

                // 随机化下落距离
                const fallDistance = 300 + Math.random() * 200;

                const animation = anime({
                    targets: emoji,
                    translateY: [
                        { value: -50, duration: duration * 0.3 },
                        { value: fallDistance, duration: duration * 0.7, easing: 'easeInQuad' }
                    ],
                    translateX: [
                        { value: randomOffsetX * 2, duration: duration }
                    ],
                    rotate: [
                        { value: -15 + Math.random() * 30, duration: duration }
                    ],
                    scale: [
                        { value: 0, duration: 0 },
                        { value: 1.2, duration: duration * 0.2 },
                        { value: 0.8, duration: duration * 0.8 }
                    ],
                    opacity: [
                        { value: 0, duration: 0 },
                        { value: 0.9, duration: duration * 0.2 },
                        { value: 0, duration: duration * 0.8 }
                    ],
                    delay: delay,
                    easing: 'easeInOutQuad'
                });

                this.animations.push(animation);
            }
        }

        this.scheduleCleanup(duration + gridRows * gridCols * 120 + 500);
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