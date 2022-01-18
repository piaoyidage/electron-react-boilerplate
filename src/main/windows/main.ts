import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import {
  resolveHtmlPath,
  isDevelopment,
  installExtensions,
  getAssetPath,
  preloadPath,
} from '../util';
import MenuBuilder from '../menu';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let willQuitApp = false;

const create = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: preloadPath,
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

  mainWindow.on('close', (e: any) => {
    if (willQuitApp) {
      mainWindow = null;
    } else {
      e.preventDefault();
      (mainWindow as BrowserWindow).hide();
    }
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

const send = (channel: string, ...args: any[]) => {
  (mainWindow as BrowserWindow).webContents.send(channel, ...args);
};

const show = () => {
  if ((mainWindow as BrowserWindow).isMinimized()) {
    (mainWindow as BrowserWindow).restore();
  }
  (mainWindow as BrowserWindow).show();
};

const close = () => {
  if (mainWindow) {
    willQuitApp = true;
    (mainWindow as BrowserWindow).close();
  }
};

export { create, send, show, close };
