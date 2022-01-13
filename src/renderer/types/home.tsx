import Credit from '../components/credit';
import InterestRate from '../components/interest-rate';
import Calculator from '../pages/calculator';
import Setting from '../pages/setting';

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
