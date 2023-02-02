import React from "react";
import emptyImg from "@/assets/empty.png";
import errorImg from "@/assets/error.png";
import { Image, View } from "@tarojs/components";
import style from './index.module.scss';

const Empty = ({ type = "empty", src, text }) => {

  const des = text || type === 'error'? '请求数据出错了，请稍后再试':'暂无数据';
  const imgSrc = src || type === 'error'? errorImg:emptyImg;

  return (
    <View className={style.wrap}>
      <Image src={imgSrc} className={style.img} mode='aspectFit' />
      <View className={style.text}>{des}</View>
    </View>
  );
};

export default Empty;
