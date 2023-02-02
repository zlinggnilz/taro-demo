import { Component } from 'react';
import Taro from '@tarojs/taro';
import { CoverView, CoverImage } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import './index.scss';

const list = [
  {
    pagePath: '/pages/index/index',
    selectedIconPath: '../assets/tab-icons/home-on.png',
    iconPath: '../assets/tab-icons/home.png',
    text: '首页',
    code:'home'
  },
  {
    pagePath: '/pages/user/index',
    selectedIconPath: '../assets/tab-icons/user-on.png',
    iconPath: '../assets/tab-icons/user.png',
    text: '个人中心',
    code:'user'
  },
  {
    pagePath: '/pages/userContent/index',
    selectedIconPath: '../assets/tab-icons/published-on.png',
    iconPath: '../assets/tab-icons/published.png',
    text: '我发布的',
    code:'published'
  },
  {
    pagePath: '/pages/campaign/index',
    selectedIconPath: '../assets/tab-icons/campaign-on.png',
    iconPath: '../assets/tab-icons/campaign.png',
    text: '活动',
    code:'campaign'
  },
]

const listCodes = list.reduce((total,item)=>{
  total[item.code] = item;
  return total
},{})

@inject('userStore')
@observer
class TabBar extends Component {
  state = {
    selected: 'home',
    color: '#000000',
    selectedColor: '#DC143C',
  };

  switchTab = (code) => {
    const { isLogin } = this.props.userStore

    // this.setSelected(code);

    if(!listCodes[code]){
      return
    }

    const url =  listCodes[code].pagePath

    if(code === 'published' && !isLogin){
      Taro.navigateTo({ url: `/pages/login/index?redirect=${url}` });

    }else{

      Taro.switchTab({ url });
    }
  };

  setSelected(idx) {
    console.log("🚀 ~ file: index.jsx:60 ~ TabBar ~ setSelected ~ idx", idx)
    this.setState({
      selected: idx,
    });
  }

  render() {
    const {  selected, color, selectedColor } = this.state;

    return (
      <CoverView className="tab-bar">
        <CoverView className="tab-bar-border"></CoverView>
        {list.map((item) => {
          return (
            <CoverView
              key={item.code}
              className="tab-bar-item"
              onClick={() => {
                this.switchTab(item.code);
              }}
            >
              <CoverImage src={selected === item.code ? item.selectedIconPath : item.iconPath} />
              <CoverView style={{ color: selected === item.code ? selectedColor : color }}>
                {item.text}
              </CoverView>
            </CoverView>
          );
        })}
      </CoverView>
    );
  }
}

export default TabBar;
