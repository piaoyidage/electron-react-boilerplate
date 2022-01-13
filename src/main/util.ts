/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import url from 'url';
import path from 'path';

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
    return url.format({
      protocol: 'file',
      pathname: path.resolve(__dirname, '../renderer/', htmlFileName),
    }) + hash
      ? `#/${hash}`
      : '';
    // return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}
