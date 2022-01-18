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
import { app } from 'electron';
import { isDevelopment } from './util';
import store from './store';
import {
  create as createMainWindow,
  show as showMainWindow,
  close as closeMainWindow,
} from './windows/main';
import {
  create as createLoginWindow,
  show as showLoginWindow,
} from './windows/login';
import handleIPC from './ipc';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevelopment) {
  // require('electron-debug')();
  // 默认关掉 devtools，command+shift+i 切换打开关闭
  require('electron-debug')({ showDevTools: false });
}

handleIPC();

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
console.log(app.getAppPath(), 'app path3');
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
      if (store.get('login')) {
        showMainWindow();
      } else {
        showLoginWindow();
      }
    });

    app.on('before-quit', () => {
      closeMainWindow();
    });
  })
  .catch(console.log);
