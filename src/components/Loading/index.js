import React, { useMemo } from 'react';
import Empty from '../Empty';
import { AtActivityIndicator } from 'taro-ui';
import { View } from '@tarojs/components';
import style from './index.module.scss';

const Loading = ({ state, children, showError = true, center = false, data, showEmpty = true }) => {
  const mode = useMemo(() => (center === true ? 'center' : 'normal'), [center]);

  if (state === 'error' && showError) {
    return <Empty type="error" />;
  }

  if (state === 'done' && showEmpty && data && data.length === 0) {
    return <Empty />;
  }

  return (
    <>
      {state === 'pending' && (
        <View className={mode === 'center' ? '' : style.wrap}>
          <AtActivityIndicator className={style.loading} mode={mode}></AtActivityIndicator>
        </View>
      )}
      {children}
    </>
  );
};

export default Loading;
