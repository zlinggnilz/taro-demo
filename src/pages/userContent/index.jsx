import { useMemo, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import List from '@/components/List';
import { AtFab } from 'taro-ui';
import { shallow } from 'zustand/shallow';
import useUserStore from '@/store/useUserStore';
import style from './index.module.scss';
import './index.scss';

const UserContent = () => {
  const { isLogin, userInfo, list, listState, fetchList } = useUserStore(
    (state) => ({
      isLogin: state.isLogin,
      userInfo: state.userInfo,
      list: state.list,
      listState: state.listState,
      fetchList: state.fetchList,
    }),
    shallow
  );

  const pageCtx = useMemo(() => Taro.getCurrentInstance().page, []);

  const getList = useCallback(
    (v) =>
      fetchList({
        uid: userInfo.uid,
        page: v,
        start: v,
        length: 20,
      }),
    []
  );

  useDidShow(() => {
    if (!isLogin) {
      Taro.redirectTo({ url: `/pages/login/index?redirect=/pages/userContent/index` });
    } else {
      getList(1);

      const tabbar = Taro.getTabBar(pageCtx);
      tabbar?.setSelected('published');
    }
  });

  usePullDownRefresh(() => {
    getList(1).finally(() => {
      Taro.stopPullDownRefresh();
    });
  });

  // const calc = () => {
  //   let query = Taro.createSelectorQuery();
  //   query.selectAll(`.waterFallItem`).boundingClientRect();
  //   query.exec((ret) => {
  //     let styleStr = '';
  //     ret[0].forEach((ele, ii) => {
  //       let height = ele.height;
  //       let span = parseInt(height / 20); //  grid-auto-row
  //       styleStr += `--item-span-${ii}: auto / span ${span};`;
  //     });
  //     setWaterStyle(styleStr + `display:grid;margin:0;`);
  //   });
  // };

  const handleClick = () => {
    Taro.navigateTo({ url: '/pages/userPublish/index' });
  };

  const renderItem = (record, index) => {
    return (
      <View className={style.item}>
        <View key={record.feedId} className='flex'>
          <View className='flex-box'>
            {record.text}
            <View className='mt-4'>
              {record.tagList.map((item) => (
                <View key={item.tagId} className='tag'>
                  {item.name}
                </View>
              ))}
            </View>
          </View>
          <Image src={record.imageUrl} className={style.img} />
        </View>
      </View>
    );
  };

  return (
    <View className='container'>
      <List
        className={style.wrap}
        // style={waterStyle}
        state={listState}
        dataSource={list}
        renderItem={renderItem}
      ></List>
      <View className={style.customPublish}>
        <AtFab onClick={handleClick}>
          <Text className='at-fab__icon at-icon at-icon-add'></Text>
        </AtFab>
      </View>
    </View>
  );
};

export default UserContent;
