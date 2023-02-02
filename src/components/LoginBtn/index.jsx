import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
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

  const wxLogin = () => {
    return new Promise((resolve, reject) => {
      Taro.login({
        success: function (res) {
          if (res.code) {
            resolve(res.code);
          } else {
            reject();
          }
        },
      });
    });
  };

  const handlePhone = async (e) => {
    console.log(e);
    const { encryptedData, iv, errMsg } = e.detail;
    if (errMsg === 'getPhoneNumber:ok') {
      // setLoading(true);
      try {
        const code = await wxLogin();
        const params = {
          code,
          encryptedData,
          iv,
        };

        Taro.checkSession({
          success: async () => {
            await userStore.login(params);
            phoneCallback && phoneCallback();
            Taro.showToast({
              title: '登录成功',
              icon: 'none',
              duration: 2000,
            });
          },
          fail: () => {
            Taro.showToast({
              title: '登录失败，请重试',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      } catch (error) {
      } finally {
        // setLoading(false);
      }
    }
  };

  const handleLogin = async () => {
    await userStore.login({
      code: '1',
      encryptedData: '1',
      iv: '1',
    });
    phoneCallback && phoneCallback();
  };

  const handleUserInfo = () => {
    // Taro.getOpenUserInfo({
    //   fail: (error) => {
    //     console.error('getAuthUserInfo', error);
    //   },
    //   success: (res) => {
    //     console.log(`userInfo:`, res);
    //     const info = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
    //     userStore.setUserInfo(info)
    //     console.log(info)
    //     Taro.showModal({
    //       title: '基础信息',
    //       content: JSON.stringify(info),
    //     })
    //   }
    // });
  };

  if (!isLogin) {
    return (
      <>
        {phoneDesc}
        <View className="py-8 font-28">个人版不能获取手机号，点击假装登录</View>
        <AtButton
          type="primary"
          // openType="getPhoneNumber"
          // onGetPhoneNumber={handlePhone}
          onClick={handleLogin}
          loading={state === 'pending'}
          {...btnProps}
        >
          {phoneText}
        </AtButton>
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
