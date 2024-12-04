const { app, BrowserWindow, globalShortcut, screen, ipcMain, Notification } = require('electron');
const path = require('path');

const MAX_LISTENERS = 20; // 设置一个合理的最大监听器数量
let currentAnimationPromise = null; // 用于跟踪当前动画

let mainWindow = null;
let currentDisplay = 0; // 当前显示器索引
let lastAnimationStart = 0;
const ANIMATION_DURATION = 6000; // 动画持续时间
const isDebug = process.env.DEBUG === 'true';
console.log('Debug mode:', isDebug); // 用于验证环境变量是否正确传递

function logWithTime(message) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    fractionalSecondDigits: 3 
  });
  console.log(`[${timeStr}] ${message}`);
}

async function handleHotkey(type) {
  logWithTime(`触发${type}动画`);
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }

  if (!mainWindow.isVisible()) {
    mainWindow.showInactive();
    logWithTime('显示窗口');
  }

  // 如果有正在进行的动画，先清理它
  if (currentAnimationPromise) {
    ipcMain.removeAllListeners('animation-complete');
  }

  // 更新最后一次动画开始时间
  lastAnimationStart = Date.now();
  mainWindow.webContents.send('trigger-animation', type);

  // 设置最大监听器数量
  ipcMain.setMaxListeners(MAX_LISTENERS);

  currentAnimationPromise = new Promise((resolve) => {
    const cleanup = () => {
      ipcMain.removeListener('animation-complete', handler);
    };
    
    const handler = () => {
      cleanup();
      const timeSinceLastAnimation = Date.now() - lastAnimationStart;
      if (timeSinceLastAnimation >= ANIMATION_DURATION) {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.hide();
          logWithTime('动画完成，隐藏窗口');
        }
      }
      resolve();
    };
    
    ipcMain.once('animation-complete', handler);
    
    setTimeout(() => {
      cleanup();
      const timeSinceLastAnimation = Date.now() - lastAnimationStart;
      if (timeSinceLastAnimation >= ANIMATION_DURATION && !isDebug) {
        // 非调试模式才自动隐藏
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.hide();
          logWithTime('动画超时，隐藏窗口');
        }
      }
      resolve();
    }, ANIMATION_DURATION);
  });

  return currentAnimationPromise;
}

function showNotification(title, body) {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      timeoutType: 'default',
      silent: true
    });
    notification.show();
    // 2秒后自动关闭通知
    setTimeout(() => notification.close(), 2000);
  }
}

function switchDisplay() {
  const displays = screen.getAllDisplays();
  currentDisplay = (currentDisplay + 1) % displays.length;
  
  if (mainWindow && !mainWindow.isDestroyed()) {
    const display = displays[currentDisplay];
    
    // 更新窗口尺寸和位置
    mainWindow.setBounds({
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height
    });
    
    // 向渲染进程发送显示器信息
    mainWindow.webContents.send('display-changed', {
      width: display.bounds.width,
      height: display.bounds.height,
      scaleFactor: display.scaleFactor
    });
    
    if (isDebug) {
      // Debug模式下确保窗口可见并打开开发者工具
      mainWindow.show();
      if (!mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.openDevTools();
      }
    } else {
      // 非Debug模式才执行自动隐藏
      setTimeout(() => {
        mainWindow.hide();
      }, 1000); // 给一个短暂延时让用户能看到切换效果
    }

    // 显示切换显示器的通知
    showNotification(
      '切换显示器',
      `已切换到显示器 ${currentDisplay + 1}/${displays.length}`
    );
  }
}

function registerGlobalHotkeys(window) {
  globalShortcut.unregisterAll();

  // 注册显示器切换热键
  globalShortcut.register('Alt+D', () => switchDisplay());
  globalShortcut.register('Option+D', () => switchDisplay());

  // 注册动画触发热键
  globalShortcut.register('Alt+V', () => handleHotkey('success'));
  globalShortcut.register('Alt+F', () => handleHotkey('failure'));
  globalShortcut.register('Option+V', () => handleHotkey('success'));
  globalShortcut.register('Option+F', () => handleHotkey('failure'));

  // 注册方案切换热键 (Alt+0 到 Alt+4)
  for (let i = 0; i <= 4; i++) {
    const showSchemeNotification = () => {
      window.webContents.send('switch-animation-scheme', i);
      logWithTime(`切换到动画方案 ${i}`);
      
      // 显示切换方案的通知
      let schemeName;
      switch(i) {
        case 0:
          schemeName = '默认方案';
          break;
        case 1:
          schemeName = '彩纸气球方案';
          break;
        case 2:
          schemeName = '星星烟花方案';
          break;
        default:
          schemeName = `方案${i}`;
      }
      showNotification('切换动画方案', schemeName);
    };

    // 修改这里：确保回调函数被正确绑定
    globalShortcut.register(`Alt+${i}`, showSchemeNotification);
    globalShortcut.register(`Option+${i}`, showSchemeNotification);
  }
}

function createWindow() {
  const displays = screen.getAllDisplays();
  const display = displays[currentDisplay];
  
  mainWindow = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    show: isDebug,  // 调试模式下直接显示
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setAlwaysOnTop(true, "floating");
  
  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false);
  }

  // 添加日志
  logWithTime('创建窗口');

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-start-loading', () => {
    logWithTime('开始加载页面');
  });

  if (isDebug) {
    mainWindow.webContents.openDevTools(); // 打开开发者工具
  }

  mainWindow.webContents.on('did-finish-load', () => {
    logWithTime('页面加载完成');
    if (!isDebug) {
      mainWindow.hide(); // 非调试模式才自动隐藏
      logWithTime('窗口隐藏');
    }
  });

  // 窗口准备好后注册热键
  mainWindow.on('ready-to-show', () => {
    registerGlobalHotkeys(mainWindow);
  });

  // 窗口恢复时重新注册热键
  mainWindow.on('restore', () => {
    registerGlobalHotkeys(mainWindow);
  });

  // 窗口显示时重新注册热键
  mainWindow.on('show', () => {
    logWithTime('窗口显示');
    registerGlobalHotkeys(mainWindow);
  });

  mainWindow.on('hide', () => {
    logWithTime('窗口隐藏');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备就绪时创建窗口
app.whenReady().then(createWindow);

// 处理窗口激活
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前清理热键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});