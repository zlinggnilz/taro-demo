import {useMemo} from 'react';
import { observer, inject } from 'mobx-react';
import { View ,Image} from '@tarojs/components';
import Taro from '@tarojs/taro';
import style from './index.module.scss';

const UserCard = ({ globalStore ,userStore}) => {
  const { headerBtnPosi } = globalStore;
  const { isLogin, userInfo } = userStore;

  const pageCtx = useMemo(() => Taro.getCurrentInstance().page, []);


  const handleClick = () => {
    // Taro.navigateTo({ url: '/pages/user/index' });

    const tabbar = Taro.getTabBar(pageCtx);
      tabbar?.switchTab('user');
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
        {/* <open-data type="userAvatarUrl"></open-data> */}
        {isLogin&&userInfo.avatar&&<Image src={userInfo.avatar} width={`${headerBtnPosi.height - 8}`} height={`${headerBtnPosi.height - 8}`}></Image>}
      </View>
      <View className={style.name}>
        {/* <open-data type="userNickName"></open-data> */}
        个人中心
      </View>
    </View>
  );
};

export default inject('globalStore', 'userStore')(observer(UserCard));
