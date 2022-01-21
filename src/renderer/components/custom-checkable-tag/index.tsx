import { useState } from 'react';
import { Tag } from 'antd';
import { ChoiceType, TagItem } from '../../types/common';

const { CheckableTag } = Tag;

interface PropType {
  id: string;
  choiceType: ChoiceType;
  filterList: TagItem[];
  onSearch: (id: string, selectedTags: TagItem[]) => void;
}

const CustomCheckableTag = (props: PropType) => {
  const { id, filterList, onSearch, choiceType } = props;
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);

  const handleChange = (tag: TagItem, checked: boolean) => {
    let nextSelectedTags;
    if (choiceType === ChoiceType.Single) {
      nextSelectedTags = checked ? [tag] : [];
    } else {
      nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);
    }
    setSelectedTags(nextSelectedTags);
    onSearch(id, nextSelectedTags);
  };

  return (
    <>
      {filterList.map((tag) => (
        <CheckableTag
          key={tag.value}
          checked={selectedTags.indexOf(tag) > -1}
          onChange={(checked) => handleChange(tag, checked)}
        >
          {tag.label}
        </CheckableTag>
      ))}
    </>
  );
};

export default CustomCheckableTag;
