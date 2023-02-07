import { useState, memo } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import classnames from 'classnames';
import style from './index.module.scss';

const PromiseAction = ({ children, className, onClick, params, color, successMessage }) => {
  const [loading, setloading] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (loading) {
      return;
    }

    const handle = onClick(params);

    if (!(handle && handle.then)) {
      console.warn('PromiseAction onClick should return Promise');
      return;
    }
    setloading(true);

    handle.then(
      function () {
        setloading(false);
        successMessage && Taro.showToast({ title: successMessage, icon: 'none' });
      },
      function (err) {
        setloading(false);
        console.log('err', err);
      }
    );
  };

  return (
    <View className={classnames(className, style.action)} onClick={handleClick}>
      {loading ? <AtActivityIndicator className={style.loading} color={color} /> : children}
    </View>
  );
};

export default memo(PromiseAction);
