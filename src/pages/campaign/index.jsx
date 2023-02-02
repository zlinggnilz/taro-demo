import {  useCallback,  createRef,useMemo } from 'react';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro, {
  useDidShow,
  usePullDownRefresh,
  useReachBottom,
} from '@tarojs/taro';
import ListMore from '@/components/ListMore';
import style from './index.module.scss';

const Campaign = ({ campaignStore }) => {
  const { list, listState, } = campaignStore;


  const listRef = createRef();

  const pageCtx = useMemo(() => Taro.getCurrentInstance().page, []);

  useDidShow(() => {
    listRef.current.getList({ start: -1, page: 1 });
    const tabbar = Taro.getTabBar(pageCtx)
    tabbar?.setSelected('campaign')
  });

  usePullDownRefresh(() => {
    listRef.current.getList({page: 1 , pageSize:20}).finally(() => {
      Taro.stopPullDownRefresh();
    });
  });
  useReachBottom(() => {
    listRef.current.getList();
  });


  const renderItem = useCallback((item) => {
    return <View className={style.item}>
      <View className='mb-2'>{item.name}</View>
      <View className='font-24 mb-2'>Code: {item.campaignCode}</View>
      <View className='font-24 text-gray'>Status: {item.status}</View>
      <View className='font-24 text-gray'>Date: {item.startDate&&(new Date(item.startDate).toLocaleDateString())} - {item.endDate&&(new Date(item.endDate).toLocaleDateString())}</View>
    </View>;
  }, []);



  return (
    <>
      <View className="container pt-8 px-8">
        <ListMore
          ref={listRef}
          dataSource={list}
          renderItem={renderItem}
          state={listState}
          loadingCenter={false}
          fetchList={campaignStore.fetchList}
          pageData={campaignStore.listPage}
        />
      </View>

    </>
  );
};

export default inject('campaignStore')(observer(Campaign));