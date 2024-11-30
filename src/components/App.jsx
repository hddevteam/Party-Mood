import React, { useState, useEffect } from 'react';
import '../assets/styles.css';
import 'animate.css';
import { registerHotkeys } from '../utils/hotkeys';

const App = () => {
    const [isVictory, setIsVictory] = useState(null);
    const [animate, setAnimate] = useState(false);
    const [secondaryAnimate, setSecondaryAnimate] = useState(false);

    useEffect(() => {
        const cleanup = registerHotkeys((victory) => {
            setIsVictory(victory);
            setAnimate(true);
            
            // 调整时间以匹配 CSS 动画时间
            const FIRST_ANIMATION_DURATION = 1000; // 第一个动画时间
            const SECONDARY_ANIMATION_DURATION = 1600; // 第二个动画时间（两次循环）
            
            // 入场动画结束后开始第二个动画
            const secondaryTimer = setTimeout(() => {
                setSecondaryAnimate(true);
            }, FIRST_ANIMATION_DURATION);

            // 最后重置所有动画状态
            const resetTimer = setTimeout(() => {
                setAnimate(false);
                setSecondaryAnimate(false);
            }, FIRST_ANIMATION_DURATION + SECONDARY_ANIMATION_DURATION);

            // 清理定时器
            return () => {
                clearTimeout(secondaryTimer);
                clearTimeout(resetTimer);
            };
        });
        return cleanup;
    }, []);

    const getAnimationClass = () => {
        if (!animate && !secondaryAnimate) return '';
        
        const primaryAnimation = isVictory ? 'animate__bounceIn' : 'animate__wobble';
        const secondaryAnimation = isVictory ? 'animate__pulse' : 'animate__rubberBand';
        
        // 只返回当前激活的动画
        if (animate && !secondaryAnimate) {
            return `animate__animated ${primaryAnimation}`;
        }
        if (secondaryAnimate) {
            return `animate__animated ${secondaryAnimation}`;
        }
        return '';
    };

    return (
        <div className={`app ${isVictory === null ? '' : isVictory ? 'victory' : 'failure'}`}>
            <h1 className={getAnimationClass()}>
                {isVictory === null ? '欢迎' : isVictory ? '胜利!' : '失败!'}
            </h1>
        </div>
    );
};

export default App;