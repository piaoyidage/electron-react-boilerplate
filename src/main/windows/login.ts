import { BrowserWindow } from 'electron';
import {
  installExtensions,
  isDevelopment,
  preloadPath,
  resolveHtmlPath,
} from '../util';

let loginWindow: BrowserWindow | null = null;

const create = async () => {
  if (isDevelopment) {
    await installExtensions();
  }
  loginWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 600,
    center: true,
    webPreferences: {
      preload: preloadPath,
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

const send = (channel: string, ...args: any[]) => {
  (loginWindow as BrowserWindow).webContents.send(channel, ...args);
};

const show = () => {
  if ((loginWindow as BrowserWindow).isMinimized()) {
    (loginWindow as BrowserWindow).restore();
  }
  (loginWindow as BrowserWindow).show();
};

const close = () => {
  (loginWindow as BrowserWindow).close();
};

export { create, send, show, close };
