## 创建项目
```
yarn global add @tarojs/cli

taro init myApp

yarn install
```

## 微信小程序

上线之前要执行build  
```
npm run dev:weapp

npm run build:weapp
```

## 项目目录结构
```
├── dist                          编译结果目录
├── config                        配置目录
|   ├── dev.js                    开发时配置
|   ├── index.js                  默认配置
|   └── prod.js                   打包时配置
├── src                           源码目录
|   ├── pages                     页面文件目录
|   |   ├── index                 index 页面目录
|   |   |   ├── index.js          index 页面逻辑
|   |   |   ├── index.config.js   index 页面配置
|   |   |   └── index.css         index 页面样式
|   ├── app.css                   项目总通用样式
|   ├── app.config.js             项目全局配置
|   └── app.js                    **项目入口文件**
└── package.json
```
全局配置放在app.config.js中  
页面配置可以写在 index.config.js中,也可以写在index.js中  

---

## Taro 与 小程序

- 页面结构跟小程序一样差不多
  > taro： `js`, `config.js`, `scss`  
  > 小程序: `js`, `json`, `wxml`, `wxss`

- 小程序的生命周期方法在 Taro 中都支持使用。
  > class 组件 on 开头  
  > function 组件 use 开头的对应 hooks

- 遍历的数组列表，尽量不要编写复杂的组件。
  > 复杂的组件：包含多个小组件。  
  > 遍历成列表的时候，用到组件都会被遍历生成 wxml 放在小程序页面中，导致页面内容过多，可能造成卡顿。通用的组件，保证页面上总是只有一个。

- 页面中的 CSS className 可以不用 css module, 但组件要用 css module, 或者组件 class 取名的时候都取特定的名称。
  > 打包出来的文件，页面的跟小程序一样，组件是放在一个文件中的，所以 class 名称一定要区分开。

- CSS 单位，使用 px, Taro 编译的时候会转成 rpx, 默认以 750 的设计稿为准。
  > css 单位通常按照设计稿写 px 即可。不需要转成 rpx 的地方写成大写的 `PX`。  
  > **注意：** 在编辑器中格式化 scss 文件时，不要用 prettier，会把 `PX` 转成 `px`

---


## MobX 状态管理

https://cn.mobx.js.org/  

常用API

- @observable 可观察的状态值
- @action  修改状态
- runInAction  异步回调修改状态
- flow     使用生成器函数, 不需要写 action 和 runInAction
- @computed 根据现有的状态或其它计算值衍生出的值


## 组件示例

https://nervjs.github.io/taro/docs/react

```jsx
import React, { Component } from 'react';
import { View } from '@tarojs/components';

class Index extends Component {
  // 可以使用所有的 React 组件方法
  componentDidMount() {}

  // onLoad
  onLoad() {}

  // onReady
  onReady() {}

  // 对应 onShow
  componentDidShow() {}

  // 对应 onHide
  componentDidHide() {}

  // 对应 onPullDownRefresh，除了 componentDidShow/componentDidHide 之外，
  // 所有页面生命周期函数名都与小程序相对应
  onPullDownRefresh() {}

  render() {
    return <View className="index" />;
  }
}

export default Index;
```

```jsx
import React, { useEffect } from 'react';
import { View } from '@tarojs/components';
import { useReady, useDidShow, useDidHide, usePullDownRefresh } from '@tarojs/taro';

function Index() {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onReady
  useReady(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Taro 文档】-> 【进阶指南】->【Hooks】
  usePullDownRefresh(() => {});

  return <View className="index" />;
}

export default Index;
```
