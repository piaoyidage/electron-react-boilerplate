import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import Home from './pages/home';
import Login from './pages/login';
import { MenuActionType, menuConfig } from './types/home';

import 'antd/dist/antd.css';
import './App.css';

moment.locale('zh-cn');

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      ipcRenderer: {
        send: (key: string, value: any) => void;
        openWindow: (hash: string, winOptions?: any) => void;
        loginSuccess: () => void;
      };
    };
  }
}

const otherRoutes = menuConfig
  .filter((m) => m.type === MenuActionType.Popup)
  .map((r) => <Route path={r.key} element={<r.component />} />);

const homeRoute = <Route path="/" element={<Home />} />;

const loginRoute = <Route path="login" element={<Login />} />;

const allRoutes = [homeRoute, loginRoute].concat(otherRoutes);

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>{allRoutes}</Routes>
      </Router>
    </ConfigProvider>
  );
}
