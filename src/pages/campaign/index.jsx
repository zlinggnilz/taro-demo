import {  useCallback,  createRef,useMemo,memo } from 'react';
import { View } from '@tarojs/components';
import Taro, {
  useDidShow,
  usePullDownRefresh,
  useReachBottom,
} from '@tarojs/taro';
import ListMore from '@/components/ListMore';
import shallow from 'zustand/shallow'
import useCampaignStore from '@/store/useCampaignStore';
import style from './index.module.scss';

const Campaign = ( ) => {
  const { list, listState,fetchList,listPage } = useCampaignStore(state=>({
    list:state.list, listState:state.listState,fetchList:state.fetchList,listPage:state.listPage,
  }),shallow);


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
          fetchList={fetchList}
          pageData={listPage}
        />
      </View>

    </>
  );
};

export default memo(Campaign);
