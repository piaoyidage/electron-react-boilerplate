export interface TagItem {
  value: string | number;
  label: string;
}

// 单选、多选
export enum ChoiceType {
  Single,
  Multiple,
}

export interface Filter {
  id: string;
  choiceType: ChoiceType;
  filterList: TagItem[];
}
