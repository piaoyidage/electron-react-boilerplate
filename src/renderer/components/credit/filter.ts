/* eslint-disable import/prefer-default-export */
import { ChoiceType, Filter } from '../../types/common';
// 筛选配置

// 国债、央票、金融债、地方债
export const bonds: Filter = {
  id: 'bond',
  choiceType: ChoiceType.Single,
  filterList: [
    {
      value: 0,
      label: 'ALL',
    },
    {
      value: 1,
      label: '国债',
    },
    {
      value: 2,
      label: '央票',
    },
    {
      value: 3,
      label: '金融债',
    },
    {
      value: 4,
      label: '地方债',
    },
  ],
};

// 工作日
export const days: Filter = {
  id: 'day',
  choiceType: ChoiceType.Single,
  filterList: [
    {
      value: 0,
      label: 'ALL',
    },
    {
      value: 1,
      label: '工作日',
    },
    {
      value: 2,
      label: '节假日',
    },
  ],
};

// 交易所
export const places: Filter = {
  id: 'place',
  choiceType: ChoiceType.Multiple,
  filterList: [
    {
      value: 0,
      label: 'ALL',
    },
    {
      value: 1,
      label: '上交所',
    },
    {
      value: 2,
      label: '深交所',
    },
  ],
};
