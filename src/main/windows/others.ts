import { BrowserWindow } from 'electron';
import {
  getAssetPath,
  installExtensions,
  isDevelopment,
  preloadPath,
  resolveHtmlPath,
} from '../util';

const otherWindows: Record<string, BrowserWindow> = {};

const openWindow = async (hash: string, options: Record<any, any>) => {
  if (isDevelopment) {
    await installExtensions();
  }

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
        preload: preloadPath,
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

// eslint-disable-next-line import/prefer-default-export
export { openWindow };
