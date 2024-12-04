const { app, BrowserWindow, globalShortcut, screen, ipcMain, Notification } = require('electron');
const path = require('path');

const MAX_LISTENERS = 20;
let currentAnimationPromise = null; // Used to track the current animation

let mainWindow = null;
let currentDisplay = 0; // Current display index
let lastAnimationStart = 0;
const ANIMATION_DURATION = 6000; // Animation duration
const isDebug = process.env.DEBUG === 'true';
console.log('Debug mode:', isDebug); // Used to verify if the environment variable is passed correctly

function logWithTime(message) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    fractionalSecondDigits: 3 
  });
  console.log(`[${timeStr}] ${message}`);
}

async function handleHotkey(type) {
  logWithTime(`Triggered ${type} animation`);
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }

  if (!mainWindow.isVisible()) {
    mainWindow.showInactive();
    logWithTime('Window shown');
  }

  // If there is an ongoing animation, clean it up first
  if (currentAnimationPromise) {
    ipcMain.removeAllListeners('animation-complete');
  }

  // Update the last animation start time
  lastAnimationStart = Date.now();
  mainWindow.webContents.send('trigger-animation', type);

  // Set the maximum number of listeners
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
          logWithTime('Animation completed, hiding window');
        }
      }
      resolve();
    };
    
    ipcMain.once('animation-complete', handler);
    
    setTimeout(() => {
      cleanup();
      const timeSinceLastAnimation = Date.now() - lastAnimationStart;
      if (timeSinceLastAnimation >= ANIMATION_DURATION && !isDebug) {
        // Only auto-hide in non-debug mode
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.hide();
          logWithTime('Animation timeout, hiding window');
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
    // Automatically close the notification after 2 seconds
    setTimeout(() => notification.close(), 2000);
  }
}

function switchDisplay() {
  const displays = screen.getAllDisplays();
  currentDisplay = (currentDisplay + 1) % displays.length;
  
  if (mainWindow && !mainWindow.isDestroyed()) {
    const display = displays[currentDisplay];
    
    // Update window size and position
    mainWindow.setBounds({
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height
    });
    
    // Send display information to the renderer process
    mainWindow.webContents.send('display-changed', {
      width: display.bounds.width,
      height: display.bounds.height,
      scaleFactor: display.scaleFactor
    });
    
    if (isDebug) {
      // Ensure the window is visible and open developer tools in debug mode
      mainWindow.show();
      if (!mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.openDevTools();
      }
    } else {
      // Only auto-hide in non-debug mode
      setTimeout(() => {
        mainWindow.hide();
      }, 1000); // Give a short delay to let the user see the switching effect
    }

    // Show notification for switching display
    showNotification(
      'Switch Display',
      `Switched to display ${currentDisplay + 1}/${displays.length}`
    );
  }
}

function registerGlobalHotkeys(window) {
  globalShortcut.unregisterAll();

  // Register hotkeys for switching display
  globalShortcut.register('Alt+D', () => switchDisplay());
  globalShortcut.register('Option+D', () => switchDisplay());

  // Register hotkeys for triggering animations
  globalShortcut.register('Alt+V', () => handleHotkey('success'));
  globalShortcut.register('Alt+F', () => handleHotkey('failure'));
  globalShortcut.register('Option+V', () => handleHotkey('success'));
  globalShortcut.register('Option+F', () => handleHotkey('failure'));

  // Register hotkeys for switching schemes (Alt+0 to Alt+4)
  for (let i = 0; i <= 4; i++) {
    const showSchemeNotification = () => {
      window.webContents.send('switch-animation-scheme', i);
      logWithTime(`Switched to animation scheme ${i}`);
      
      // Show notification for switching scheme
      let schemeName;
      switch(i) {
        case 0:
          schemeName = 'Default Scheme';
          break;
        case 1:
          schemeName = 'Confetti Balloon Scheme';
          break;
        case 2:
          schemeName = 'Star Firework Scheme';
          break;
        default:
          schemeName = `Scheme ${i}`;
      }
      showNotification('Switch Animation Scheme', schemeName);
    };

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
    show: isDebug,  // Show directly in debug mode
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

  logWithTime('Window created');

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-start-loading', () => {
    logWithTime('Page loading started');
  });

  if (isDebug) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    logWithTime('Page loading completed');
    if (!isDebug) {
      mainWindow.hide();
      logWithTime('Window hidden');
    }
  });

  mainWindow.on('ready-to-show', () => {
    registerGlobalHotkeys(mainWindow);
  });

  mainWindow.on('restore', () => {
    registerGlobalHotkeys(mainWindow);
  });

  mainWindow.on('show', () => {
    logWithTime('Window shown');
    registerGlobalHotkeys(mainWindow);
  });

  mainWindow.on('hide', () => {
    logWithTime('Window hidden');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when the application is ready
app.whenReady().then(createWindow);

// Handle window activation
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Quit the application when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up hotkeys before the application quits
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});