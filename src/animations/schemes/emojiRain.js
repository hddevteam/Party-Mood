import anime from 'animejs';
import { AnimationScheme } from '../animationScheme.js';

export class EmojiRainScheme extends AnimationScheme {
    constructor() {
        super('emojiRain');  // Ensure to call the parent class constructor
        this.animations = [];
        this.emojiSets = {
            success: [
                ['🎉', '⭐', '🌟', '🎊'],  // Celebration set
                ['🏆', '💪', '👑', '✨'],  // Achievement set
                ['🌈', '🎈', '🎨', '🎯'],  // Joy set
                ['💫', '⚡', '🔥', '💥'],  // Energy set
                ['🌺', '🌸', '🍀', '🌟']   // Nature set
            ],
            failure: [
                ['😢', '😭', '💔', '🌧'],  // Sadness set
                ['😓', '😩', '😣', '😖'],  // Trouble set
                ['⛈', '🌫', '🌪', '⚡'],   // Bad weather set
                ['😶', '😔', '😕', '😫'],  // Disappointment set
                ['💨', '🕸', '🍂', '🌑']   // Desolation set
            ]
        };
        
        // Record the index of the last used set
        this.lastSuccessIndex = -1;
        this.lastFailureIndex = -1;
        
        // Currently used emoji set
        this.currentSuccessEmojis = [];
        this.currentFailureEmojis = [];
        this.startTime = null;
        this.cleanupTimer = null; // 添加清理定时器
    }

    getRandomEmojiSet(type) {
        const sets = this.emojiSets[type];
        let index;
        
        // 确保不会连续使用相同的组合
        do {
            index = Math.floor(Math.random() * sets.length);
        } while (index === (type === 'success' ? this.lastSuccessIndex : this.lastFailureIndex));
        
        if (type === 'success') {
            this.lastSuccessIndex = index;
            this.currentSuccessEmojis = sets[index];
        } else {
            this.lastFailureIndex = index;
            this.currentFailureEmojis = sets[index];
        }
        
        return sets[index];
    }

    createEmoji(emoji, isSuccess) {
        const element = document.createElement('div');
        const size = 40 + Math.random() * 20; // Random size between 40-60px
        
        element.style.cssText = `
            position: fixed;
            font-size: ${size}px;
            user-select: none;
            pointer-events: none;
            z-index: ${this.zIndex};
            transform-origin: center;
            opacity: 0;
            filter: drop-shadow(0 0 10px ${isSuccess ? '#FFD700' : '#696969'});
            will-change: transform, opacity;
        `;
        element.textContent = emoji;
        return element;
    }

    async playSuccessAnimation() {
        this.startTime = Date.now();
        this.setupContainer();
        const duration = 3000;
        const emojisCount = 30;
        
        // Get a new random emoji set
        const emojiSet = this.getRandomEmojiSet('success');
        console.log(`🎬 成功动画开始时间: ${new Date(this.startTime).toLocaleTimeString()}`);

        for (let i = 0; i < emojisCount; i++) {
            const emoji = this.createEmoji(
                emojiSet[i % emojiSet.length],
                true
            );
            this.container.appendChild(emoji);

            // 设置���始位置
            const startX = Math.random() * window.innerWidth;
            emoji.style.left = `${startX}px`;
            emoji.style.top = '-50px';

            // 创建动画
            const animation = anime.timeline({
                targets: emoji,
                duration: duration,
                easing: 'easeOutQuad',
                delay: i * 100
            }).add({
                translateY: [
                    { value: window.innerHeight / 2 - 100, duration: duration * 0.6 },
                    { value: window.innerHeight + 50, duration: duration * 0.4 }
                ],
                translateX: [
                    { value: anime.random(-30, 30), duration: duration * 0.3 },
                    { value: anime.random(-60, 60), duration: duration * 0.3 },
                    { value: anime.random(-30, 30), duration: duration * 0.4 }
                ],
                rotate: [
                    { value: anime.random(-15, 15), duration: duration * 0.5 },
                    { value: anime.random(-30, 30), duration: duration * 0.5 }
                ],
                scale: [
                    { value: 1, duration: duration * 0.3 },
                    { value: 1.5, duration: duration * 0.2 },
                    { value: 0, duration: duration * 0.5 }
                ],
                opacity: [
                    { value: 1, duration: duration * 0.2 },
                    { value: 1, duration: duration * 0.6 },
                    { value: 0, duration: duration * 0.2 }
                ]
            });

            this.animations.push(animation);
        }

        // Calculate the estimated end time and record it
        const totalDuration = duration + emojisCount * 100 + 500;
        const endTime = this.startTime + totalDuration;
        console.log(`⏱️ 预计结束时间: ${new Date(endTime).toLocaleTimeString()}`);
        console.log(`📊 动画总时长: ${totalDuration}ms`);

        // Record when the animation actually ends
        setTimeout(() => {
            const actualEndTime = Date.now();
            console.log(`🏁 实际结束时间: ${new Date(actualEndTime).toLocaleTimeString()}`);
            console.log(`⚡  实际执行时长: ${actualEndTime - this.startTime}ms`);
        }, totalDuration);

        // Set cleanup timer
        this.scheduleCleanup(totalDuration);
    }

    async playFailureAnimation() {
        this.startTime = Date.now();
        this.setupContainer();
        const duration = 2500;
        const emojisCount = 20;
        
        console.log(`🎬 失败动画开始时间: ${new Date(this.startTime).toLocaleTimeString()}`);

        // Get a new random emoji set
        const emojiSet = this.getRandomEmojiSet('failure');

        for (let i = 0; i < emojisCount; i++) {
            const emoji = this.createEmoji(
                emojiSet[i % emojiSet.length],
                false
            );
            this.container.appendChild(emoji);

            // 设置初始位置
            const startX = Math.random() * window.innerWidth;
            emoji.style.left = `${startX}px`;
            emoji.style.bottom = '-50px';

            // 创建动画
            const animation = anime.timeline({
                targets: emoji,
                duration: duration,
                easing: 'easeOutCubic',
                delay: i * 150
            }).add({
                translateY: [
                    { value: -window.innerHeight / 2, duration: duration }
                ],
                translateX: [
                    { value: anime.random(-20, 20), duration: duration * 0.2 },
                    { value: anime.random(-40, 40), duration: duration * 0.3 },
                    { value: anime.random(-20, 20), duration: duration * 0.5 }
                ],
                rotate: [
                    { value: anime.random(-10, 10), duration: duration * 0.3, easing: 'easeInOutSine' },
                    { value: anime.random(-15, 15), duration: duration * 0.7, easing: 'easeInOutSine' }
                ],
                scale: [
                    { value: 1, duration: duration * 0.2 },
                    { value: 0.8, duration: duration * 0.8 }
                ],
                opacity: [
                    { value: 1, duration: duration * 0.2 },
                    { value: 0, duration: duration * 0.8 }
                ]
            });

            this.animations.push(animation);
        }

        // Calculate the estimated end time and record it
        const totalDuration = duration + emojisCount * 150 + 500;
        const endTime = this.startTime + totalDuration;
        console.log(`⏱️ 预计结束时间: ${new Date(endTime).toLocaleTimeString()}`);
        console.log(`📊 动画总时长: ${totalDuration}ms`);

        // Record when the animation actually ends
        setTimeout(() => {
            const actualEndTime = Date.now();
            console.log(`🏁 实际结束时间: ${new Date(actualEndTime).toLocaleTimeString()}`);
            console.log(`⚡ 实际执行时长: ${actualEndTime - this.startTime}ms`);
        }, totalDuration);

        // Set cleanup timer
        this.scheduleCleanup(totalDuration);
    }

    setupContainer() {
        if (this.container) {
            this.cleanup();
        }
        this.container = this.createAnimationContainer();
    }

    cleanup() {
        console.log('🧹 清理动画');
        // 清除之前的定时器
        if (this.cleanupTimer) {
            clearTimeout(this.cleanupTimer);
            this.cleanupTimer = null;
        }

        if (this.container) {
            // 停止所有动画
            this.animations.forEach(animation => animation.pause());
            this.animations = [];
            super.cleanup();
        }
    }

    scheduleCleanup(delay) {
        // 清除之前的定时器
        if (this.cleanupTimer) {
            clearTimeout(this.cleanupTimer);
        }
        
        // 设置新的清理定时器
        this.cleanupTimer = setTimeout(() => {
            this.cleanup();
            this.cleanupTimer = null;
        }, delay);
    }
}