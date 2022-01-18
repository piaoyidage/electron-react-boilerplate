import { ipcMain } from 'electron';
import store from './store';
import { create as createMainWindow } from './windows/main';
import { close as closeLoginWindow } from './windows/login';
import { openWindow } from './windows/others';

export default function handleIPC() {
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
    closeLoginWindow();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    createMainWindow();
  });
}
