import JSConfetti from 'js-confetti';
import anime from 'animejs';
import { AnimationScheme } from '../animationScheme.js';

export class ConfettiAndBalloonsScheme extends AnimationScheme {
    constructor() {
        super('confettiAndBalloons');
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
        const container = this.createAnimationContainer();
        // 创建气球容器，但将高度设置为屏幕高度的两倍，以允许气球飞得更高
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: ${window.innerHeight * 1.5}px;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'];
        const balloons = [];
        
        // 创建气球
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * window.innerWidth;
            const balloon = this.createBalloon(container, colors[i % colors.length], x);
            balloons.push(balloon);
        }

        // 修改气球动画，使其飞得更高并确保完全清理
        const balloonAnimation = anime.timeline({
            targets: balloons,
            easing: 'easeOutExpo'
        })
        .add({
            translateY: -window.innerHeight * 1.5, // 飞到屏幕高度1.5倍的位置
            duration: 4000,
            delay: anime.stagger(200),
            complete: () => {
                // 动画完成后立即清理气球
                balloons.forEach(balloon => balloon.remove());
            }
        });

        this.animations.push(balloonAnimation);

        // 添加彩纸效果
        this.jsConfetti.addConfetti({
            confettiColors: colors,
            confettiNumber: 200,
        });

        // 保存容器引用以便后续清理
        this.container = container;

        // 设置定时器在动画结束后清理容器
        setTimeout(() => {
            if (this.container === container) {
                container.remove();
                this.container = null;
            }
        }, 5000); // 稍微比动画时长长一些，确保所有效果都完成
    }

    async playFailureAnimation() {
        const container = this.createAnimationContainer();
        // 创建气球容器
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

        // 修改气球上升并爆炸动画
        balloons.forEach((balloon, index) => {
            const animation = anime.timeline({
                easing: 'easeOutQuad'
            })
            .add({
                targets: balloon,
                translateY: -window.innerHeight * 0.6,
                duration: 2000,
                delay: index * 200
            })
            .add({
                targets: balloon,
                duration: 100,
                complete: () => {
                    this.createExplosion(balloon, colors[index % colors.length]);
                }
            })
            .add({
                targets: balloon,
                opacity: 0,
                duration: 300,
                complete: () => {
                    balloon.style.display = 'none'; // 确保完全隐藏
                }
            });

            this.animations.push(animation);
        });

        // 添加延迟清理
        setTimeout(() => {
            container.remove();
        }, 4000);

        // 灰色彩纸保持不变
        this.jsConfetti.addConfetti({
            confettiColors: colors,
            confettiNumber: 100,
        });

        this.container = container;
    }

    cleanup() {
        // 停止所有动画
        this.animations.forEach(animation => animation.pause());
        this.animations = [];

        super.cleanup(); // 调用父类的cleanup方法
    }
}