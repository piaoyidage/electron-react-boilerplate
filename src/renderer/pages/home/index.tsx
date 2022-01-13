import React, { useState } from 'react';
import { Menu, Tabs } from 'antd';

import { MenuActionType, menuConfig, MenuItemConfig } from '../../types/home';

const { SubMenu, Item: MenuItem } = Menu;
const { TabPane } = Tabs;

// 过滤所有页面，用于 Tab 页展示
const getAllPages = (config: MenuItemConfig[]): MenuItemConfig[] => {
  let pages: MenuItemConfig[] = [];
  config.forEach((c) => {
    const { children, type } = c;
    if (children) {
      pages = pages.concat(getAllPages(children));
    }
    if (type === MenuActionType.Page) {
      pages.push(c);
    }
  });
  return pages;
};

const pages = getAllPages(menuConfig);

// 过滤所有弹窗
const getAllWindows = (config: MenuItemConfig[]): MenuItemConfig[] => {
  return config.filter((c) => c.type === MenuActionType.Popup);
};

const popups = getAllWindows(menuConfig);

const Home = () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [panes, setPanes] = useState<MenuItemConfig[]>([]);

  const add = (page: MenuItemConfig) => {
    const newPanes = [...panes];
    if (!newPanes.find((item) => item.key === page.key)) {
      newPanes.push(page);
      setPanes(newPanes);
    }
  };

  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setActiveKey(newActiveKey);
    setPanes(newPanes);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'remove' | 'add'
  ) => {
    if (action === 'remove') {
      remove(targetKey as string);
    }
  };

  const handleClickMenu = (e: any) => {
    const page = pages.find((item) => item.key === e.key);
    const popup = popups.find((item) => item.key === e.key);
    if (page) {
      setActiveKey(e.key);
      add(page);
    } else if (popup) {
      window.electron.ipcRenderer.openWindow(e.key, popup.winOptions);
    }
  };

  const handleChangeTab = (key: string) => {
    setActiveKey(key);
  };

  const renderTabs = () => {
    return (
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={handleChangeTab}
        onEdit={onEdit}
        hideAdd
      >
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable>
            <pane.component />
          </TabPane>
        ))}
      </Tabs>
    );
  };

  const renderMenu = () => {
    return (
      <Menu
        mode="horizontal"
        onClick={handleClickMenu}
        selectedKeys={[activeKey]}
      >
        {menuConfig.map((item) => {
          const { key, title, children } = item;
          if (children) {
            return (
              <SubMenu key={key} title={title}>
                {children.map((c) => (
                  <MenuItem key={c.key}>{c.title}</MenuItem>
                ))}
              </SubMenu>
            );
          }
          return <MenuItem key={key}>{title}</MenuItem>;
        })}
      </Menu>
    );
  };
  return (
    <div>
      {renderMenu()}
      {renderTabs()}
    </div>
  );
};

export default Home;
