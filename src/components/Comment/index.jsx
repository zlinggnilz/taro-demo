import React, { useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PromiseAction from '@/components/PromiseAction';
import { observer, inject } from 'mobx-react';
import style from './index.module.scss';

const Comment = ({
  data,
  avatar,
  name,
  children,
  contentStore,
  userStore,
  className,
  onClick,
  showAvatar,
}) => {
  const { userInfo, isLogin } = userStore;

  const handleLike = () => {
    if (!isLogin) {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }

    const params = { commentId: data.commentId, uid: userInfo.uid, replyId: data.replyId };

    return data.isLike ? contentStore.commentUnLike(params) : contentStore.commentLike(params);
  };

  const handleClick = () => {
    onClick && onClick(data);
  };

  return (
    <View className={`flex ${style.comment} ${className || ''}`}>
      {showAvatar && (
        <View className={style.commentAvatar}>
          <Image className={style.commentAvatar} src={avatar} mode="aspectFill" />
        </View>
      )}

      <View className="flex-box">
        <View className="flex">
          <View className={`flex-box ${style.commentContent}`} onClick={handleClick}>
            <Text className={style.commentName}>{name || data.name}</Text> <Text className={style.commentTime}>{data.createTime}</Text>
            <View className={style.commentText}>{data.text}</View>
          </View>
          <View>
            <PromiseAction className={style.commentIcon} onClick={handleLike}>
              <View
                className={`at-icon ${data.isLike ? 'at-icon-heart-2 text-red' : 'at-icon-heart'}`}
              ></View>
            </PromiseAction>
          </View>
        </View>
        {children}
      </View>
    </View>
  );
};

export default inject('contentStore', 'userStore')(observer(Comment));
