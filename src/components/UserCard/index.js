import React from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import style from './index.module.scss';

const UserCard = ({ globalStore }) => {
  const { headerBtnPosi } = globalStore;

  const handleClick = () => {
    Taro.navigateTo({ url: '/pages/user/index' });
  };

  return (
    <View
      className={style.user}
      style={{
        width: headerBtnPosi.width,
        height: headerBtnPosi.height,
        borderRadius: headerBtnPosi.height / 2,
      }}
      onClick={handleClick}
    >
      <View
        className={style.avatar}
        style={{
          width: headerBtnPosi.height - 8,
          height: headerBtnPosi.height - 8,
        }}
      >
        <open-data type="userAvatarUrl"></open-data>
      </View>
      <View className={style.name}>
        {/* <open-data type="userNickName"></open-data> */}
        个人中心
      </View>
    </View>
  );
};

export default inject('globalStore')(observer(UserCard));
