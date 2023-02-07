import { memo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import PromiseAction from '@/components/PromiseAction';
// import {feedImg} from '@/constant';
import ContentImg from '@/assets/where.jpg';
import { shallow } from 'zustand/shallow';
import useUserStore from '@/store/useUserStore';
import useContentStore from '@/store/useContentStore';
import style from './index.module.scss';

const Feed = ({ data, handleCommentFetch, handleShare }) => {
  const { userInfo, isLogin } = useUserStore(
    (state) => ({
      userInfo: state.userInfo,
      isLogin: state.isLogin,
    }),
    shallow
  );

  const { feedUnLike, feedLike } = useContentStore(
    (state) => ({ feedUnLike: state.feedUnLike, feedLike: state.feedLike }),
    shallow
  );

  const handleLike = () => {
    if (!isLogin) {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }

    const params = { feedId: data.feedId, uid: userInfo.uid };

    return data.isLike ? feedUnLike(params) : feedLike(params);
  };

  const handleComment = () => {
    if (!isLogin) {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }

    handleCommentFetch(data);
  };

  return (
    <>
      <View key={data.feedId} className={style.feed}>
        <View className={style.content}>
          <View className='flex align-middle'>
            <Image src={data.avatarUrl} className={style.avatar} />
            <View className={`${style.name} flex-box`}>{data.name}</View>
            <View className={style.view}>
              <View className='at-icon at-icon-eye'></View>
              {data.viewCount}
            </View>
          </View>
          {data.text && <View className={style.text}>{data.text}</View>}
          {data.tagList && data.tagList.length && (
            <View className={style.tagList}>
              {data.tagList.map((item) => (
                <View key={item.tagId} className='tag'>
                  {item.name}
                </View>
              ))}
            </View>
          )}
          {data.imageUrl && (
            <View>
              <Image src={ContentImg} className={style.img} mode='widthFix' />
            </View>
          )}
        </View>
        <View className={`${style.action} flex align-middle`}>
          <PromiseAction className='flex-box' onClick={handleLike}>
            <View
              className={`at-icon ${data.isLike ? 'at-icon-heart-2 text-red' : 'at-icon-heart'}`}
            ></View>
            {data.likeCount > 0 && <Text className={style.actionNum}>{data.likeCount}</Text>}
          </PromiseAction>
          <View className='flex-box' onClick={handleComment}>
            <View className='at-icon at-icon-message'></View>
          </View>
          <View
            className='flex-box'
            onClick={() => {
              handleShare(data);
            }}
          >
            <View className='at-icon at-icon-share'></View>
          </View>
        </View>
      </View>
    </>
  );
};

export default memo(Feed);
