import { memo } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PromiseAction from '@/components/PromiseAction';
import useUserStore from '@/store/useUserStore';
import useContentStore from '@/store/useContentStore';
import { shallow } from 'zustand/shallow';
import style from './index.module.scss';

const Comment = ({ data, avatar, name, children, className, onClick, showAvatar }) => {
  const { userInfo, isLogin } = useUserStore(
    (state) => ({
      userInfo: state.userInfo,
      isLogin: state.isLogin,
    }),
    shallow
  );

  const { commentUnLike, commentLike } = useContentStore(
    (state) => ({
      commentUnLike: state.commentUnLike,
      commentLike: state.commentLike,
    }),
    shallow
  );

  const handleLike = () => {
    if (!isLogin) {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }

    const params = { commentId: data.commentId, uid: userInfo.uid, replyId: data.replyId };

    return data.isLike ? commentUnLike(params) : commentLike(params);
  };

  const handleClick = () => {
    onClick && onClick(data);
  };

  return (
    <View className={`flex ${style.comment} ${className || ''}`}>
      {showAvatar && (
        <View className={style.commentAvatar}>
          <Image className={style.commentAvatar} src={avatar} mode='aspectFill' />
        </View>
      )}

      <View className='flex-box'>
        <View className='flex'>
          <View className={`flex-box ${style.commentContent}`} onClick={handleClick}>
            <Text className={style.commentName}>{name || data.name}</Text>{' '}
            <Text className={style.commentTime}>{data.createTime}</Text>
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

export default memo(Comment);
