import { useMemo } from 'react';
import { View, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import LoginBtn from '@/components/LoginBtn/index';
import { shallow } from 'zustand/shallow';
import useUserStore from '@/store/useUserStore';
import style from './index.module.scss';

const User = () => {
  const { isLogin, userInfo, logout, loginState } = useUserStore(
    (state) => ({
      isLogin: state.isLogin,
      userInfo: state.userInfo,
      logout: state.logout,
      loginState: state.loginState,
    }),
    shallow
  );
  const pageCtx = useMemo(() => Taro.getCurrentInstance().page, []);

  const toMyFeeds = () => {
    // Taro.navigateTo({ url: '/pages/userContent/index' });
    const tabbar = Taro.getTabBar(pageCtx);
    tabbar?.switchTab('published');
  };

  useDidShow(() => {
    const tabbar = Taro.getTabBar(pageCtx);
    tabbar?.setSelected('user');
  });

  // const handleLogout=()=>{

  // }

  return (
    <>
      <View className={style.top}>
        <View className='flex align-middle'>
          <View className={style.avatar}>
            {/* {process.env.TARO_ENV === 'weapp' && <open-data type="userAvatarUrl"></open-data>}
            {process.env.TARO_ENV === 'alipay' && userInfo.avatar && <Image src={userInfo.avatar} className={style.avatarImg}></Image>} */}
            {isLogin && userInfo.avatar && (
              <Image src={userInfo.avatar} className={style.avatarImg}></Image>
            )}
          </View>

          <View className='flex-box'>
            {isLogin ? (
              userInfo.name
            ) : (
              <LoginBtn state={loginState} btnProps={{ size: 'small', className: style.logBtn }} />
            )}
          </View>
        </View>
      </View>

      <View className={style.list}>
        {isLogin && (
          <View className={style.listItem} onClick={toMyFeeds}>
            我的发布
          </View>
        )}
        <View className={style.listItem}>
          意见反馈<Button open-type='feedback' className={style.feedbackBtn}></Button>
        </View>
        <View className={style.listItem}>关注公众号</View>
        <View className={style.listItem}>作者微信号</View>
        <View className={style.listItem}>关于我们</View>
        {isLogin && (
          <View className={style.listItem} onClick={logout}>
            退出登录
          </View>
        )}
      </View>
    </>
  );
};

export default User;
