/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
/* eslint global-require: off */

import url from 'url';
import path from 'path';
import { app } from 'electron';

const { URL } = url;

export let resolveHtmlPath: (htmlFileName: string, hash?: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string, hash?: string) => {
    const result = new URL(`http://localhost:${port}`);
    result.pathname = htmlFileName;
    if (hash) {
      result.hash = hash;
    }
    return result.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string, hash?: string) => {
    return `file://${path.resolve(
      __dirname,
      '../renderer/',
      `${htmlFileName}${hash ? `#/${hash}` : ''}`
    )}`;
  };
}

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const installExtensions = async () => {
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

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

// 注意，preload 路径解析问题
export const preloadPath = path.join(__dirname, 'preload.js');
