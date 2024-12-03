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
            // 先重置所有状态
            setIsVictory(null);
            setAnimate(false);
            setSecondaryAnimate(false);
            
            // 使用 requestAnimationFrame 确保状态重置后再触发新动画
            requestAnimationFrame(() => {
                // 设置新的状态
                setIsVictory(victory);
                setAnimate(true);
                
                const FIRST_ANIMATION_DURATION = 1000;
                const SECONDARY_ANIMATION_DURATION = 1600;
                
                const secondaryTimer = setTimeout(() => {
                    setSecondaryAnimate(true);
                }, FIRST_ANIMATION_DURATION);

                const resetTimer = setTimeout(() => {
                    setAnimate(false);
                    setSecondaryAnimate(false);
                }, FIRST_ANIMATION_DURATION + SECONDARY_ANIMATION_DURATION);

                return () => {
                    clearTimeout(secondaryTimer);
                    clearTimeout(resetTimer);
                };
            });
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
                {isVictory === null ? '欢迎' : isVictory ? '成功!' : '失败!'}
            </h1>
        </div>
    );
};

export default App;