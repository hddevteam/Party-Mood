// 动画方案的基础接口
export class AnimationScheme {
    constructor(name) {
        this.name = name;
        this.container = null;
        this.zIndex = 9999; // 默认动画层级
    }
    
    // 创建独立的动画容器
    createAnimationContainer() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: ${this.zIndex};
        `;
        document.body.appendChild(this.container);
        return this.container;
    }
    
    playSuccessAnimation() {
        throw new Error('Must implement playSuccessAnimation');
    }
    
    playFailureAnimation() {
        throw new Error('Must implement playFailureAnimation');
    }
    
    cleanup() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}