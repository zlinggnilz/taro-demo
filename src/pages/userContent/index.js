import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro, { useDidShow } from '@tarojs/taro';
import List from '@/components/List';
import { AtFab } from 'taro-ui';
import style from './index.module.scss';
import './index.scss';

const UserContent = ({ userStore }) => {
  const { userInfo, list, listState } = userStore;

  const [waterStyle, setWaterStyle] = useState('');

  useDidShow(() => {
    setWaterStyle('')
    userStore
      .fetchList({
        uid: userInfo.uid,
        start: '1',
        length: 20,
      })
      .then(() => {
        Taro.nextTick(() => {
          calc();
        });
      });
  });

  const calc = () => {
    let query = Taro.createSelectorQuery();
    query.selectAll(`.waterFallItem`).boundingClientRect();
    query.exec((ret) => {
      let styleStr = '';
      ret[0].forEach((ele, ii) => {
        let height = ele.height;
        let span = parseInt(height / 20); //  grid-auto-row
        styleStr += `--item-span-${ii}: auto / span ${span};`;
      });
      setWaterStyle(styleStr + `display:grid;margin:0;`);
    });
  };

  const handleClick = () => {
    Taro.navigateTo({ url: '/pages/userPublish/index' });
  };

  const renderItem = (record, index) => {
    return (
      <View
        key={record.feedId}
        className={`${waterStyle ? 'waterFallItemactive ' : ''}waterFallItem`}
        style={`grid-row:var(--item-span-${index});`}
      >
        {record.text}
      </View>
    );
  };

  return (
    <View>
      <List
        className="waterFall"
        style={waterStyle}
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
