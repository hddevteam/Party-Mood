// renderer.js 文件负责与用户界面交互，处理事件和更新界面。

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { registerHotkeys } from './utils/hotkeys';

const renderApp = () => {
    const container = document.getElementById('root');
    if (!container) {
        throw new Error('找不到 root 元素');
    }
    const root = createRoot(container);
    root.render(createElement(App));
};

const init = () => {
    registerHotkeys();
    renderApp();
};

init();