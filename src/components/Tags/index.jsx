import { useEffect, useMemo, memo } from 'react';
import { View } from '@tarojs/components';
import style from './index.module.scss';

const Tags = ({ value = [], dataSource = [], onChange }) => {
  useEffect(() => {}, []);

  const dataSourceObj = useMemo(
    () =>
      dataSource.reduce((total, item) => {
        total[item.value] = item.label;
        return total;
      }, {}),
    [dataSource]
  );

  const handleRemove = (index) => () => {
    const arr = value.filter((item, i) => i !== index);
    onChange && onChange(arr);
  };

  return (
    <View>
      {value.map((item, index) => (
        <View className={style.tag} key={item}>
          {dataSourceObj[item]}
          <View
            className={`${style.remove} at-icon at-icon-close`}
            onClick={handleRemove(index)}
          ></View>
        </View>
      ))}
    </View>
  );
};

export default memo(Tags);
