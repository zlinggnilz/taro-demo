import {memo} from 'react';
import { View  } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import shallow from 'zustand/shallow'
import useGlobalStore from '@/store/useGlobalStore';
import style from './index.module.scss';

const NavBar = (props) => {
  const { className, title, rightContent, noBorder } = props;

  const { navHeight,statusBarHeight,navPadding,headerBtnPosi} = useGlobalStore(state=>({
    navHeight:state.navHeight,statusBarHeight:state.statusBarHeight,navPadding:state.navPadding,headerBtnPosi:state.headerBtnPosi,
  }),shallow)

  const leftBtn = (
    <View className="at-icon at-icon-chevron-left nav-left-icon" onClick={Taro.navigateBack}></View>
  );

  const left = 'leftContent' in props ? props.leftContent : leftBtn;
  if (process.env.TARO_ENV === 'alipay') {
    return (
      <View
        style={{
          height: navHeight + statusBarHeight,
          paddingTop: statusBarHeight,
          paddingLeft: 16,
          paddingRight: 16,
        }}
        className={classnames(className, style.bar, { [style.noBorder]: noBorder })}
      >
        <View className={style.left}>
          {left}
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        height: navHeight,
        paddingTop: statusBarHeight,
        paddingLeft: navPadding,
        paddingRight: navPadding,
      }}
      className={classnames(className, style.bar, { [style.noBorder]: noBorder })}
    >
      <View className={style.left} style={{ width: headerBtnPosi.width }}>
        {left}
      </View>
      <View className={style.title}>{title}</View>
      <View className={style.right} style={{ width: headerBtnPosi.width }}>
        {rightContent}
      </View>
    </View>
  );
};

export default memo(NavBar);
