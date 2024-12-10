// 动画方案的基础接口
export class AnimationScheme {
    constructor(name, isBackground = false) {
        this.name = name;
        this.container = null;
        // 根据是否是背景动画来设置z-index
        this.zIndex = isBackground ? 998 : 9999; // 背景动画设置为998，前景动画保持9999
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