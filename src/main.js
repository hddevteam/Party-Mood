const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow = null;

function registerGlobalHotkeys(window) {
  // 在注册热键前先清除所有已注册的热键
  globalShortcut.unregisterAll();

  const sendAnimation = (type) => {
    // 确保窗口存在且未被销毁
    if (window && !window.isDestroyed()) {
      window.webContents.send('trigger-animation', type);
    }
  };

  // 注册胜利热键
  globalShortcut.register('Alt+V', () => {
    sendAnimation('success');
  });

  // 注册失败热键
  globalShortcut.register('Alt+F', () => {
    sendAnimation('failure');
  });

  // macOS 特定的快捷键
  globalShortcut.register('Option+V', () => {
    sendAnimation('success');
  });
  
  globalShortcut.register('Option+F', () => {
    sendAnimation('failure');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // 添加以下配置
    transparent: true,          // 窗口透明
    frame: false,              // 无边框
    alwaysOnTop: true,        // 始终置顶
    hasShadow: false,         // 无阴影
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // 设置窗口层级为浮动面板
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setAlwaysOnTop(true, "floating");
  
  // 在 macOS 上设置窗口级别高于普通窗口
  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false);
  }

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

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
    registerGlobalHotkeys(mainWindow);
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