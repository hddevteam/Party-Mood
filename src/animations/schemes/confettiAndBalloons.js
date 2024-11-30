import JSConfetti from 'js-confetti';
import anime from 'animejs';
import party from 'party-js';

export class ConfettiAndBalloonsScheme {
    constructor() {
        this.name = 'confettiAndBalloons';
        this.jsConfetti = new JSConfetti();
        this.animations = [];
    }

    createBalloon(container, color, x) {
        // 创建气球容器
        const balloonContainer = document.createElement('div');
        balloonContainer.style.cssText = `
            position: fixed;
            bottom: -100px;
            left: ${x}px;
            transform-origin: center bottom;
            transform: rotate(${Math.random() * 10 - 5}deg);
        `;

        // 创建气球主体
        const balloon = document.createElement('div');
        balloon.style.cssText = `
            width: 50px;
            height: 65px;
            background: ${color};
            border-radius: 50%;
            position: relative;
            box-shadow: inset -10px -10px 12px rgba(0,0,0,0.15);
            animation: balloonFloat 2s ease-in-out infinite;
            opacity: 0.9;
        `;

        // 创建气球下部
        const bottom = document.createElement('div');
        bottom.style.cssText = `
            width: 12px;
            height: 12px;
            background: ${color};
            position: absolute;
            bottom: -6px;
            left: 19px;
            transform: rotate(45deg);
        `;

        // 创建气球绳
        const string = document.createElement('div');
        string.style.cssText = `
            width: 2px;
            height: 50px;
            background: rgba(255,255,255,0.7);
            position: absolute;
            bottom: -50px;
            left: 24px;
            transform-origin: top center;
            animation: stringWave 2s ease-in-out infinite;
        `;

        // 添加所有元素
        balloon.appendChild(bottom);
        balloonContainer.appendChild(balloon);
        balloonContainer.appendChild(string);
        container.appendChild(balloonContainer);

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes balloonFloat {
                0%, 100% { transform: translateY(-2px); }
                50% { transform: translateY(2px); }
            }
            @keyframes stringWave {
                0%, 100% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
            }
        `;
        document.head.appendChild(style);

        return balloonContainer;
    }

    createExplosion(balloon, color) {
        const particles = [];
        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                opacity: 1;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            `;
            balloon.appendChild(particle);
            particles.push(particle);
        }

        // 爆炸动画
        particles.forEach((particle, i) => {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 5 + Math.random() * 5;
            const animation = anime({
                targets: particle,
                translateX: Math.cos(angle) * 100 * velocity,
                translateY: Math.sin(angle) * 100 * velocity,
                opacity: 0,
                duration: 1000,
                easing: 'easeOutExpo',
                complete: () => particle.remove()
            });
            this.animations.push(animation);
        });
    }

    async playSuccessAnimation() {
        // 创建气球容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);

        // 创建多个气球
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'];
        const balloons = [];
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * window.innerWidth;
            const balloon = this.createBalloon(container, colors[i % colors.length], x);
            balloons.push(balloon);
        }

        // 气球上升动画
        const balloonAnimation = anime({
            targets: balloons,
            translateY: -window.innerHeight - 100,
            duration: 4000,
            easing: 'easeOutExpo',
            delay: anime.stagger(200)
        });
        this.animations.push(balloonAnimation);

        // 彩纸动画
        this.jsConfetti.addConfetti({
            confettiColors: colors,
            confettiNumber: 200,
        });

        // 保存容器引用以便清理
        this.container = container;
    }

    async playFailureAnimation() {
        // 创建气球容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);

        // 创建灰色气球
        const colors = ['#808080', '#A9A9A9', '#696969'];
        const balloons = [];
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * window.innerWidth;
            const balloon = this.createBalloon(container, colors[i % colors.length], x);
            balloons.push(balloon);
        }

        // 气球上升并爆炸动画
        balloons.forEach((balloon, index) => {
            const animation = anime({
                targets: balloon,
                translateY: -window.innerHeight * 0.6,
                duration: 2000,
                easing: 'easeOutQuad',
                delay: index * 200,
                complete: () => {
                    // 播放爆炸音效（可选）
                    const popSound = new Audio('path/to/pop-sound.mp3');
                    popSound.volume = 0.3;
                    popSound.play().catch(() => {});
                    
                    // 创建爆炸效果
                    this.createExplosion(balloon, colors[index % colors.length]);
                    
                    // 淡出气球
                    anime({
                        targets: balloon,
                        opacity: 0,
                        duration: 300,
                        easing: 'easeOutQuad',
                        complete: () => balloon.remove()
                    });
                }
            });
            this.animations.push(animation);
        });

        // 灰色彩纸
        this.jsConfetti.addConfetti({
            confettiColors: colors,
            confettiNumber: 100,
        });

        // 保存容器引用以便清理
        this.container = container;
    }

    cleanup() {
        // 停止所有动画
        this.animations.forEach(animation => animation.pause());
        this.animations = [];

        // 移除容器
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}