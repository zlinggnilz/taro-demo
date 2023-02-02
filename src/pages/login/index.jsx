import React, { useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import LoginBtn from '@/components/LoginBtn';
import loginImg from '@/assets/login.png';
import style from './index.module.scss';

const Login = ({ userStore }) => {
  const { loginState } = userStore;

  const currentInstance = getCurrentInstance();

  const phoneCallback = () => {
    setTimeout(() => {
      const redirect = currentInstance.router.params.redirect;
      if (redirect) {
        Taro.redirectTo({
          url: redirect,
        });
      } else {
        Taro.navigateBack();
      }
    }, 300);
  };

  return (
    <View className={style.wrap}>
      <View className={style.title}>今天出太阳</View>
      <Image src={loginImg} mode="aspectFit" />
      <View className={style.desc}>微信授权登录</View>
      <LoginBtn phoneCallback={phoneCallback} state={loginState} />
    </View>
  );
};

export default inject('userStore', 'globalStore')(observer(Login));
