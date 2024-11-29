import React, { useState, useEffect } from 'react';
import '../assets/styles.css';
import { registerHotkeys } from '../utils/hotkeys';

const App = () => {
    const [isVictory, setIsVictory] = useState(null);

    useEffect(() => {
        // 保存清理函数
        const cleanup = registerHotkeys(setIsVictory);
        // 组件卸载时清理事件监听
        return cleanup;
    }, []);

    return (
        <div className={`app ${isVictory === null ? '' : isVictory ? 'victory' : 'failure'}`}>
            <h1>{isVictory === null ? '欢迎' : isVictory ? '胜利!' : '失败!'}</h1>
        </div>
    );
};

export default App;