/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-use-before-define */
import { useEffect } from 'react';
import { Table } from 'antd';

import CustomCheckableTag from '../custom-checkable-tag';
import { bonds, days, places } from './filter';
import { TagItem } from '../../types/common';

import css from './index.module.css';

const Credit = () => {
  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = (id?: string, selectedTags?: TagItem[]) => {
    console.log(id, selectedTags);
    // TODO
  };

  return (
    <div className={css.wrap}>
      <h2>信用</h2>
      <div className={css.filter}>
        <div>
          <CustomCheckableTag {...bonds} onSearch={onSearch} />
          <CustomCheckableTag {...days} onSearch={onSearch} />
        </div>
        <div>
          <CustomCheckableTag {...places} onSearch={onSearch} />
        </div>
      </div>
      <div className={css.table}>
        <Table />
      </div>
    </div>
  );
};

export default Credit;
