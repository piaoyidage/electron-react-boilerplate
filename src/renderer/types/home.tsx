import Credit from '../components/credit';
import InterestRate from '../components/interest-rate';

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
  },
];
