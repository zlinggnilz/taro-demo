import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { observer, inject } from 'mobx-react';

const LoginBtn = ({
  userStore,
  phoneText = '授权登录',
  infoText = '授权用户信息',
  phoneDesc,
  infoDesc,
  needUserInfo,
  children,
  phoneCallback,
  state,
  btnProps,
}) => {
  const { isLogin, isAuthUserInfo } = userStore;

  const handlePhone = async () => {
    Taro.getPhoneNumber({
      success: async (res) => {
        console.log('🚀 ~ file: index.alipay.js ~ line 38 ~ handlePhone ~ res', res);
        let encryptedData = res.response;
        const params = { encryptedData };

        await userStore.login(params);
        phoneCallback && phoneCallback();
        Taro.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 2000,
        });
      },
      fail: (res) => {
        console.log('getPhoneNumber_fail', res);
        Taro.showToast({
          title: '登录失败，请重试',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  };

  const handleUserInfo = () => {};

  if (!isLogin) {
    return (
      <>
        {phoneDesc}
        <button
          type="primary"
          open-type="getAuthorize"
          scope="phoneNumber"
          onGetAuthorize={handlePhone}
          loading={state === 'pending'}
          {...btnProps}
        >
          {phoneText}
        </button>
      </>
    );
  }

  if (!isAuthUserInfo && needUserInfo) {
    return (
      <>
        {infoDesc}
        <AtButton
          type="primary"
          openType="getUserInfo"
          onGetUserInfo={handleUserInfo}
          loading={state === 'pending'}
          {...btnProps}
        >
          {infoText}
        </AtButton>
      </>
    );
  }

  return <>{children}</>;
};

export default inject('userStore')(observer(LoginBtn));
