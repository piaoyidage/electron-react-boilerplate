import { useState } from 'react';
import { Menu, Tabs, message } from 'antd';

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

  const onEdit = (targetKey: string, action: 'remove' | 'add') => {
    if (action === 'remove') {
      remove(targetKey);
    }
  };

  const handleClickMenu = (e: any) => {
    const page = pages.find((item) => item.key === e.key);
    if (page?.type === MenuActionType.Page) {
      setActiveKey(e.key);
      add(page);
    } else {
      message.info('弹窗正在编写中……');
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
