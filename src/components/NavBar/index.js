import React from "react";
import { View, Button, Text } from "@tarojs/components";
import classnames from "classnames";
import { observer, inject } from "mobx-react";
import Taro from '@tarojs/taro'
import style from "./index.module.scss";

const NavBar = (props) => {
  const { className, title,  rightContent, globalStore ,noBorder} = props;

  const leftBtn = <View className='at-icon at-icon-chevron-left nav-left-icon' onClick={Taro.navigateBack}></View>

  const left = 'leftContent' in props ? props.leftContent: leftBtn

  return (
    <View
      style={{
        height: globalStore.navHeight,
        paddingTop: globalStore.statusBarHeight,
        paddingLeft:globalStore.navPadding,
        paddingRight:globalStore.navPadding,
      }}
      className={classnames(className, style.bar,{ [style.noBorder]:noBorder})}
    >
      <View className={style.left} style={{width:globalStore.headerBtnPosi.width}}>{left}</View>
      <View className={style.title}>{title}</View>
      <View className={style.right} style={{width:globalStore.headerBtnPosi.width}}>{rightContent}</View>
    </View>
  );
};

export default inject("globalStore")(observer(NavBar));
