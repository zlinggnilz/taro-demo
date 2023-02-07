import { memo } from 'react';
import { View, Image } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import LoginBtn from '@/components/LoginBtn';
import loginImg from '@/assets/login.png';
import style from './index.module.scss';
import useUserStore from '@/store/useUserStore';

const Login = () => {
  const { loginState } = useUserStore(state=>state.loginState);

  const currentInstance = getCurrentInstance();

  const phoneCallback = () => {
    setTimeout(() => {
      const params = currentInstance.router.params
      const {redirect} = params;
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

export default memo(Login);
