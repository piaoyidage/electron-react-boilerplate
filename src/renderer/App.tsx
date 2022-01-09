import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import Home from './pages/home';

import 'antd/dist/antd.css';
import './App.css';

moment.locale('zh-cn');

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
