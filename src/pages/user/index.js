import React, { useEffect,useState } from 'react';
import { View, Button,Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { observer, inject } from 'mobx-react';
import LoginBtn from '@/components/LoginBtn/index';
import style from './index.module.scss';

const User = ({ userStore }) => {
  const { isLogin, userInfo } = userStore;

  const toMyFeeds = () => {
    Taro.navigateTo({ url: '/pages/userContent/index' });
  };

  const handleUserInfo=()=>{
    Taro.getOpenUserInfo({
      fail: (error) => {
        console.error('getAuthUserInfo', error);
      },
      success: (res) => {
        console.log(`userInfo:`, res);
        const info = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        userStore.setUserInfo(info)
        console.log(info)
        Taro.showModal({
          title: '基础信息',
          content: JSON.stringify(info),
        })
      }
    });
  }

  return (
    <>
      <View className={style.top}>
        <View className="flex align-middle">
          <View className={style.avatar}>
            {process.env.TARO_ENV === 'weapp' && <open-data type="userAvatarUrl"></open-data>}
            {process.env.TARO_ENV === 'alipay' && userInfo.avatar && <Image src={userInfo.avatar} className={style.avatarImg}></Image>}
          </View>

          <View className="flex-box">
            {isLogin ? (
              userInfo.name
            ) : (
              <LoginBtn
                state={userStore.loginState}
                btnProps={{ size: 'small', className: style.logBtn }}
              />
            )}
          </View>
        </View>
      </View>
      <View>
        <button
          type="ghost"
          open-type="getAuthorize"
          onGetAuthorize={handleUserInfo}
          onError="onAuthError"
          scope="userInfo"
        >
          支付宝基础信息授权
        </button>
      </View>
      <View className={style.list}>
        {isLogin && (
          <View className={style.listItem} onClick={toMyFeeds}>
            我的发布
          </View>
        )}
        <View className={style.listItem}>
          意见反馈<Button open-type="feedback" className={style.feedbackBtn}></Button>
        </View>
        <View className={style.listItem}>关注公众号</View>
        <View className={style.listItem}>作者微信号</View>
        <View className={style.listItem}>关于我们</View>
      </View>
    </>
  );
};

export default inject('globalStore', 'userStore')(observer(User));
