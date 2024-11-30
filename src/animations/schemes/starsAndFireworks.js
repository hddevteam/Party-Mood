import anime from 'animejs';
import JSConfetti from 'js-confetti';

export class StarsAndFireworksScheme {
    constructor() {
        this.name = 'starsAndFireworks';
        this.jsConfetti = new JSConfetti();
        this.animations = [];
        this.container = null;
    }

    createStar(color) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${color};
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            opacity: 0.8;
        `;
        return star;
    }

    createFirework(x, y, color) {
        const particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                top: ${y}px;
                left: ${x}px;
            `;
            this.container.appendChild(particle);
            particles.push(particle);
        }

        const animation = anime({
            targets: particles,
            translateX: (el, i) => Math.cos(2 * Math.PI * i / particleCount) * 100,
            translateY: (el, i) => Math.sin(2 * Math.PI * i / particleCount) * 100,
            scale: [1, 0],
            opacity: {
                value: 0,
                duration: 1500,
                easing: 'linear'
            },
            duration: 2000,
            easing: 'easeOutExpo',
            complete: () => {
                particles.forEach(p => p.remove());
            }
        });

        this.animations.push(animation);
    }

    async playSuccessAnimation() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);

        // 创建星星
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'];
        const stars = [];
        const starCount = 30;

        for (let i = 0; i < starCount; i++) {
            const star = this.createStar(colors[i % colors.length]);
            this.container.appendChild(star);
            stars.push(star);

            // 随机分布在屏幕边缘
            const side = Math.floor(Math.random() * 4);
            const x = side % 2 === 0 ? Math.random() * window.innerWidth : (side === 1 ? window.innerWidth : 0);
            const y = side % 2 === 1 ? Math.random() * window.innerHeight : (side === 2 ? window.innerHeight : 0);
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
        }

        // 星星汇聚动画
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const starsAnimation = anime({
            targets: stars,
            left: centerX,
            top: centerY,
            scale: [1, 0],
            opacity: {
                value: [1, 0],
                duration: 800,
                delay: 1000
            },
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                // 播放烟花
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.createFirework(
                            centerX + (Math.random() - 0.5) * 200,
                            centerY + (Math.random() - 0.5) * 200,
                            colors[i % colors.length]
                        );
                    }, i * 300);
                }
            }
        });

        this.animations.push(starsAnimation);
    }

    async playFailureAnimation() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);

        // 使用暗色
        const colors = ['#808080', '#A9A9A9', '#696969'];
        const stars = [];
        const starCount = 20;

        for (let i = 0; i < starCount; i++) {
            const star = this.createStar(colors[i % colors.length]);
            this.container.appendChild(star);
            stars.push(star);

            const side = Math.floor(Math.random() * 4);
            const x = side % 2 === 0 ? Math.random() * window.innerWidth : (side === 1 ? window.innerWidth : 0);
            const y = side % 2 === 1 ? Math.random() * window.innerHeight : (side === 2 ? window.innerHeight : 0);
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
        }

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const starsAnimation = anime({
            targets: stars,
            left: centerX,
            top: centerY,
            scale: [1, 0],
            opacity: {
                value: [0.6, 0],
                duration: 500,
                delay: 800
            },
            duration: 1200,
            easing: 'easeInOutQuad',
            complete: () => {
                // 播放较暗的烟花，更快消失
                this.createFirework(centerX, centerY, colors[0]);
            }
        });

        this.animations.push(starsAnimation);
    }

    cleanup() {
        this.animations.forEach(animation => animation.pause());
        this.animations = [];

        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}