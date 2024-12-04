import anime from 'animejs';

export class EmojiRainScheme {
    constructor() {
        this.name = 'emojiRain';
        this.animations = [];
        this.container = null;
        
        // 扩展 emoji 库
        this.emojiSets = {
            success: [
                ['🎉', '⭐', '🌟', '🎊'],  // 庆祝组合
                ['🏆', '💪', '👑', '✨'],  // 成就组合
                ['🌈', '🎈', '🎨', '🎯'],  // 欢乐组合
                ['💫', '⚡', '🔥', '💥'],  // 能量组合
                ['🌺', '🌸', '🍀', '🌟']   // 自然组合
            ],
            failure: [
                ['😢', '😭', '💔', '🌧'],  // 伤心组合
                ['😓', '😩', '😣', '😖'],  // 困扰组合
                ['⛈', '🌫', '🌪', '⚡'],   // 坏天气组合
                ['😶', '😔', '😕', '😫'],  // 失望组合
                ['💨', '🕸', '🍂', '🌑']   // 萧瑟组合
            ]
        };
        
        // 记录上次使用的组合索引
        this.lastSuccessIndex = -1;
        this.lastFailureIndex = -1;
        
        // 当前使用的emoji组合
        this.currentSuccessEmojis = [];
        this.currentFailureEmojis = [];
        this.startTime = null;
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
        const size = 40 + Math.random() * 20; // 40-60px 随机大小
        
        element.style.cssText = `
            position: fixed;
            font-size: ${size}px;
            user-select: none;
            pointer-events: none;
            z-index: 9999;
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
        
        // 获取新的随机emoji组合
        const emojiSet = this.getRandomEmojiSet('success');
        console.log(`🎬 成功动画开始时间: ${new Date(this.startTime).toLocaleTimeString()}`);

        for (let i = 0; i < emojisCount; i++) {
            const emoji = this.createEmoji(
                emojiSet[i % emojiSet.length],
                true
            );
            this.container.appendChild(emoji);

            // 设置初始位置
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

        // 计算预计结束时间并记录
        const totalDuration = duration + emojisCount * 100 + 500;
        const endTime = this.startTime + totalDuration;
        console.log(`⏱️ 预计结束时间: ${new Date(endTime).toLocaleTimeString()}`);
        console.log(`📊 动画总时长: ${totalDuration}ms`);

        // 在动画实际结束时记录
        setTimeout(() => {
            const actualEndTime = Date.now();
            console.log(`🏁 实际结束时间: ${new Date(actualEndTime).toLocaleTimeString()}`);
            console.log(`⚡ 实际执行时长: ${actualEndTime - this.startTime}ms`);
        }, totalDuration);

        // 设置清理定时器
        setTimeout(() => this.cleanup(), duration + emojisCount * 100 + 500);
    }

    async playFailureAnimation() {
        this.startTime = Date.now();
        this.setupContainer();
        const duration = 2500;
        const emojisCount = 20;
        
        console.log(`🎬 失败动画开始时间: ${new Date(this.startTime).toLocaleTimeString()}`);

        // 获取新的随机emoji组合
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

        // 计算预计结束时间并记录
        const totalDuration = duration + emojisCount * 150 + 500;
        const endTime = this.startTime + totalDuration;
        console.log(`⏱️ 预计结束时间: ${new Date(endTime).toLocaleTimeString()}`);
        console.log(`📊 动画总时长: ${totalDuration}ms`);

        // 在动画实际结束时记录
        setTimeout(() => {
            const actualEndTime = Date.now();
            console.log(`🏁 实际结束时间: ${new Date(actualEndTime).toLocaleTimeString()}`);
            console.log(`⚡ 实际执行时长: ${actualEndTime - this.startTime}ms`);
        }, totalDuration);

        // 设置清理定时器
        setTimeout(() => this.cleanup(), duration + emojisCount * 150 + 500);
    }

    setupContainer() {
        if (this.container) {
            this.cleanup();
        }
        
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    }

    cleanup() {
        if (this.container) {
            this.animations.forEach(animation => animation.pause());
            this.animations = [];
            this.container.remove();
            this.container = null;
        }
    }
}