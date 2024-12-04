import JSConfetti from 'js-confetti';
import { AnimationScheme } from '../animationScheme.js';

export class DefaultScheme extends AnimationScheme {
    constructor() {
        super('default');
        this.jsConfetti = new JSConfetti();
    }

    async playSuccessAnimation() {
        this.jsConfetti.addConfetti({
            confettiColors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'],
            confettiNumber: 200,
        });
    }

    async playFailureAnimation() {
        this.jsConfetti.addConfetti({
            confettiColors: ['#808080', '#A9A9A9', '#696969'],
            confettiNumber: 100,
        });
    }
}