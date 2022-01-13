
## 安装

```bash
yarn
```

**有安装问题? 参考 [debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

## 开始开发

`dev` 环境启动:

```bash
npm start
```

## 打包

本地平台打包:

```bash
npm run package
```

## 文档

[docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## 其他

### node 和 npm 版本 

**node**: v16.13.1

**npm**: 8.3.0

### 开启或者关闭 devtools

main.ts 中，配置如下

```ts
if (isDevelopment) {
  // require('electron-debug')();
  // 默认关掉 devtools，command+shift+i 切换打开关闭
  require('electron-debug')({ showDevTools: false });
}
```

### 如何在 render process 和 main process 通信

1. 在 preload.js 使用 `contextBridge` api 生成可以在 render process 中使用的方法

```js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    }
});
```

2. 在 App.tsx 中 declare TypeScript 描述

```ts
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing: () => void;
      };
    };
  }
}
```

3. 在 render process 中，引入暴露的方法

```ts
window.electron.ipcRenderer.myPing()
```

4. 在 main process 中，使用 ipcMain 监听 

```ts
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
```

### 多窗口设计思路

IDB 有一个主窗口，是其他功能的入口，点击菜单栏会有其他有各种弹窗，目前的思路是项目设计成 SPA，通过路由去匹配不同的窗口。

### 菜单配置

点击菜单项，假设有两种结果，一个是打开一个页面，一个是打开一个弹窗

```ts
// 点击菜单项操作类型，打开一个页面或者打开一个弹窗
export enum MenuActionType {
  Page,
  Popup,
}

export interface MenuItemConfig {
  key: string;
  title: string;
  type?: MenuActionType;
  children?: MenuItemConfig[];
  component?: any;
  // BrowserWindow 配置，详见 https://www.electronjs.org/zh/docs/latest/api/browser-window
  winOptions?: Record<any, any>;
}

export const menuConfig: MenuItemConfig[] = [
  {
    key: 'product',
    title: '产品',
    children: [
      {
        key: 'credit',
        title: '信用',
        type: MenuActionType.Page,
        component: Credit,
      },
      {
        key: 'interestRate',
        title: '利率',
        type: MenuActionType.Page,
        component: InterestRate,
      },
    ],
  },
  {
    key: 'calculator',
    title: '计算器',
    type: MenuActionType.Popup,
    component: Calculator,
    winOptions: {
      width: 1048,
      height: 728,
    },
  },
  {
    key: 'setting',
    title: '设置',
    type: MenuActionType.Popup,
    component: Setting,
    winOptions: {
      width: 400,
      height: 200,
    },
  },
];

```

如果要新增一个窗口，直接在 menuConfig 后新增配置即可，其中 key 对应 `#/${key}` 路由，component 对应渲染的页面，winOptions 是窗口的配置。

浏览器打开 `http://localhost:1212/#/${key}` 即可预览
