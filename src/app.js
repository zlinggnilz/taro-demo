/* eslint-disable */
import { Component } from 'react';
import Taro from '@tarojs/taro';
import useGlobalStore from '@/store/useGlobalStore';
import { shareImg, shareTitle } from '@/constant';

import './app.scss';

/**
 * 全局分享配置，页面无需开启分享
 * 如页面开启分享开关，则走页面分享配置（即使未配置内容）
 */
!(function () {
  //获取页面配置并进行页面分享配置
  var PageTmp = Page;
  Page = function (pageConfig) {
    let view = Page;
    //全局开启分享
    pageConfig = Object.assign(
      {
        onShareAppMessage: function () {
          return {
            title: shareTitle,
            imageUrl: shareImg,
          };
        },
      },
      pageConfig
    );
    // 配置页面模板
    PageTmp(pageConfig);
  };
})();

class App extends Component {
  constructor(props) {
    super(props);

    let res = {};
    try {
      res = Taro.getSystemInfoSync();
    } catch (e) {
      //
    }
    const btnInfo = Taro.getMenuButtonBoundingClientRect();
    const update = useGlobalStore.getState().setSysAndMenuBtnInfo;
    update(res, btnInfo);
  }

  componentDidMount() {}

  onLaunch() {}

  // 对应 onShow
  componentDidShow() {}

  // 对应 onHide
  componentDidHide() {}

  // 对应 onPullDownRefresh
  onPullDownRefresh() {}

  componentDidCatchError() {}

  render() {
    return this.props.children;
  }
}

export default App;
