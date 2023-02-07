import { useState, useImperativeHandle, forwardRef, memo } from 'react';
import { View, Text } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import Loading from '../Loading';

const List = forwardRef((props, ref) => {
  const {
    dataSource,
    state,
    renderItem,
    loadingCenter,
    showError,
    showEmpty,
    className,
    style,
    fetchList,
    pageData = {},
    pageSize = 20,
  } = props;

  const [listState, setListState] = useState('');

  const getList = (params = {}) => {
    const page = params.page || params.pageNo;
    let p = 1;
    if (page == null) {
      p = (pageData.page || 0) + 1;
    }
    if (listState === 'finish' && page !== 1) {
      return;
    }
    if (p === 1) {
      setListState('pending');
    }
    return fetchList({ length: pageSize, page: p, pageNo: p, pageSize, ...params })
      .then((data) => {
        if (p >= pageData.totalPage) {
          setListState('finish');
        } else if (data && data.length == pageSize) {
          setListState('done');
        } else {
          setListState('finish');
        }
      })
      .catch((error) => {
        console.log('🚀 getList ~ error', error);
        setListState('error');
      });
  };

  useImperativeHandle(ref, () => ({
    getList,
  }));

  return (
    <Loading
      state={listState}
      data={dataSource}
      center={loadingCenter}
      showError={showError}
      showEmpty={showEmpty}
    >
      <View className={className} style={style}>
        {dataSource && dataSource.map((...v) => renderItem && renderItem(...v))}
      </View>
      <View className='more'>
        {state === 'error' && <Text onClick={getList}>点击加载更多</Text>}
        {state == 'pending' && listState !== 'pending' && (
          <AtActivityIndicator content='加载中...'></AtActivityIndicator>
        )}
        {dataSource && dataSource.length > 0 && listState === 'finish' && '- 没有更多了 -'}
      </View>
    </Loading>
  );
});

export default memo(List);
