import React from 'react';
import { View } from '@tarojs/components';
import Loading from '../Loading';

const List = ({ dataSource, state, renderItem, loadingCenter, showError, showEmpty, className ,style}) => {
  return (
    <Loading
      state={state}
      data={dataSource}
      center={loadingCenter}
      showError={showError}
      showEmpty={showEmpty}
    >
      <View className={className} style={style}>
        {dataSource && dataSource.map((...v) => renderItem && renderItem(...v))}
      </View>
        {dataSource && dataSource.length > 0 && state === 'done' && (
          <View className="more">- 没有更多了 -</View>
        )}
    </Loading>
  );
};

export default List;
