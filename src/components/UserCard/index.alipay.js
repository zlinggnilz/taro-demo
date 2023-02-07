import {memo} from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import style from './index.module.scss';

const UserCard = () => {

  const handleClick = () => {
    Taro.navigateTo({ url: '/pages/user/index' });
  };

  return (
    <View
      className={style.user}
      style={{
        // width: headerBtnPosi.width,
        // height: headerBtnPosi.height,
        borderRadius:16,
        padding:'4px 8px'
      }}
      onClick={handleClick}
    >
      <View className={style.name}>
        个人中心
      </View>
    </View>
  );
};

export default memo(UserCard);
