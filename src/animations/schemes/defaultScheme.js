import JSConfetti from 'js-confetti';

export class DefaultScheme {
    constructor() {
        this.name = 'default';
        this.jsConfetti = new JSConfetti();
    }

    async playSuccessAnimation() {
        // 原有的默认成功动画
        this.jsConfetti.addConfetti({
            confettiColors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'],
            confettiNumber: 200,
        });
    }

    async playFailureAnimation() {
        // 原有的默认失败动画
        this.jsConfetti.addConfetti({
            confettiColors: ['#808080', '#A9A9A9', '#696969'],
            confettiNumber: 100,
        });
    }

    cleanup() {
        // 清理资源（如果需要）
    }
}