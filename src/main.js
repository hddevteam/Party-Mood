const { app, BrowserWindow, globalShortcut, screen } = require('electron');
const path = require('path');

let mainWindow = null;
let currentDisplay = 0; // 当前显示器索引

function handleHotkey(type) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }

  if (!mainWindow.isVisible()) {
    mainWindow.showInactive();
  }

  mainWindow.webContents.send('trigger-animation', type);

  // 3秒后自动隐藏窗口
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide();
    }
  }, 3000);
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
    
    // 切换显示器后短暂显示窗口
    mainWindow.show();
    setTimeout(() => {
      mainWindow.hide();
    }, 500);
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
    show: false,  // 初始时不显示窗口
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

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 在加载完成后自动隐藏窗口
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.hide();
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