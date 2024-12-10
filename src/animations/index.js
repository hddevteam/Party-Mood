import { EmojiRainScheme } from './schemes/emojiRain.js';
import { ConfettiAndBalloonsScheme } from './schemes/confettiAndBalloons.js';
import { DefaultScheme } from './schemes/defaultScheme.js';
import { StarsAndFireworksScheme } from './schemes/starsAndFireworks.js';
import { SpiralEmojiFountainScheme } from './schemes/spiralEmojiFountain.js';
import { BouncingEmojiGridScheme } from './schemes/bouncingEmojiGrid.js';

// 动画方案管理器
export class AnimationManager {
    constructor() {
        this.schemes = new Map();
        this.currentScheme = null;
    }
    
    registerScheme(id, scheme) {
        this.schemes.set(id, scheme);
    }
    
    switchScheme(id) {
        if (this.currentScheme) {
            this.currentScheme.cleanup();
        }
        this.currentScheme = this.schemes.get(id);
        return this.currentScheme;
    }
    
    getCurrentScheme() {
        return this.currentScheme;
    }

    getSchemeDescription(id) {
        const scheme = this.schemes.get(id);
        return scheme ? scheme.name : '未知方案';
    }
}

export const animationManager = new AnimationManager();

// 注册所有方案
const defaultScheme = new DefaultScheme();
const confettiAndBalloons = new ConfettiAndBalloonsScheme();
const starsAndFireworks = new StarsAndFireworksScheme();
const emojiRain = new EmojiRainScheme();
const spiralEmojiFountain = new SpiralEmojiFountainScheme();
const bouncingEmojiGrid = new BouncingEmojiGridScheme();

animationManager.registerScheme(0, defaultScheme);         // Alt+0: 默认方案
animationManager.registerScheme(1, confettiAndBalloons);   // Alt+1: 彩纸气球方案
animationManager.registerScheme(2, starsAndFireworks);     // Alt+2: 星星烟花方案
animationManager.registerScheme(3, emojiRain);             // Alt+3: Emoji雨方案
animationManager.registerScheme(4, spiralEmojiFountain);   // Alt+4: 螺旋表情喷泉方案
animationManager.registerScheme(5, bouncingEmojiGrid);     // Alt+5: 弹跳表情阵列方案

animationManager.switchScheme(0); // 设置默认方案