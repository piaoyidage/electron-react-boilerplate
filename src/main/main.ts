/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// 主窗口
let mainWindow: BrowserWindow | null = null;
// 登录窗口
let loginWindow: BrowserWindow | null = null;
// 其他窗口
const otherWindows: Record<string, BrowserWindow> = {};

// 全局数据
const store = new Store();
// store.delete('login');

// IPC listener
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (_event, key, val) => {
  store.set(key, val);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// 打开新窗口
ipcMain.on('open-window', async (_event, arg) => {
  const { hash, options } = arg;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await openWindow(hash, options);
});

// 登录成功
ipcMain.on('login-success', async (_event) => {
  store.set('login', true);
  loginWindow?.hide();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  createMainWindow();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  // require('electron-debug')();
  // 默认关掉 devtools，command+shift+i 切换打开关闭
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const openWindow = async (hash: string, options: Record<any, any>) => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  if (otherWindows?.[hash]) {
    otherWindows[hash].show();
  } else {
    const focusedWindow = BrowserWindow.getFocusedWindow() as BrowserWindow;
    const [x, y] = focusedWindow.getPosition();
    const w = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      x: x + 50,
      y: y + 50,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
      ...options,
    });

    w.loadURL(resolveHtmlPath('index.html', `/${hash}`));

    w.on('closed', () => {
      delete otherWindows[hash];
    });

    w.on('ready-to-show', () => {
      if (!w) {
        throw new Error('"window" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        w.minimize();
      } else {
        w.show();
      }
    });
    otherWindows[hash] = w;
  }
};

const createLoginWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }
  loginWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 600,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  loginWindow.loadURL(resolveHtmlPath('index.html', '/login'));

  loginWindow.on('ready-to-show', () => {
    if (!loginWindow) {
      throw new Error('"loginWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      loginWindow.minimize();
    } else {
      loginWindow.show();
    }
  });

  loginWindow.on('closed', () => {
    loginWindow = null;
  });
};

const createMainWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    console.log(store.get('login'), 'init');
    if (store.get('login')) {
      createMainWindow();
    } else {
      createLoginWindow();
    }
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null && store.get('login')) {
        createMainWindow();
      } else {
        createLoginWindow();
      }
    });
  })
  .catch(console.log);
