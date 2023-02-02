import { useMemo, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import List from '@/components/List';
import { AtFab } from 'taro-ui';
import style from './index.module.scss';
import './index.scss';

const UserContent = ({ userStore }) => {
  const { isLogin, userInfo, list, listState } = userStore;

  const pageCtx = useMemo(() => Taro.getCurrentInstance().page, []);

  const getList = useCallback(
    (v) =>
      userStore.fetchList({
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
      <View key={record.feedId} className={`${style.item} flex`}>
        <View className="flex-box">{record.text}</View>
        <Image src={record.imageUrl} className={style.img} />
      </View>
    );
  };

  return (
    <View className="container">
      <List
        className={style.wrap}
        // style={waterStyle}
        state={listState}
        dataSource={list}
        renderItem={renderItem}
      ></List>
      <View className={style.customPublish}>
        <AtFab onClick={handleClick}>
          <Text className="at-fab__icon at-icon at-icon-add"></Text>
        </AtFab>
      </View>
    </View>
  );
};

export default inject('contentStore', 'userStore')(observer(UserContent));
