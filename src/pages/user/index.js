import React, { useEffect } from 'react';
import { View,Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { observer, inject } from 'mobx-react';
import LoginBtn from '@/components/LoginBtn';
import style from './index.module.scss';

const User = ({ userStore }) => {
  const { isLogin, userInfo } = userStore;


  const toMyFeeds=()=>{
    Taro.navigateTo({url:'/pages/userContent/index'})
  }


  return (
    <>
      <View className={style.top}>
        <View className="flex align-middle">
          <View className={style.avatar}>
            <open-data type="userAvatarUrl"></open-data>
          </View>

          <View className="flex-box">
            {isLogin ? (
              userInfo.name
            ) : (
              <LoginBtn state={userStore.loginState} btnProps={{ size: 'small', className: style.logBtn }} />
            )}
          </View>
        </View>
      </View>
        <View className={style.list}>
          {isLogin && <View className={style.listItem} onClick={toMyFeeds}>我的发布</View>}
          <View className={style.listItem}>意见反馈<Button open-type='feedback' className={style.feedbackBtn}></Button></View>
          <View className={style.listItem}>关注公众号</View>
          <View className={style.listItem}>作者微信号</View>
          <View className={style.listItem}>关于我们</View>
        </View>
    </>
  );
};

export default inject('globalStore', 'userStore')(observer(User));
