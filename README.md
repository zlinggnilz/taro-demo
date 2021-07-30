## 创建项目

```
yarn global add @tarojs/cli

taro init myApp

cd myApp

yarn install
```

## 微信小程序

上线之前要执行 build

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

全局配置放在 app.config.js 中  
页面配置可以写在 index.config.js 中,也可以写在 index.js 中

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
  > 遍历成列表的时候，用到组件都会被遍历生成 wxml 放在小程序页面中，导致页面内容过多，可能造成卡顿。

- 页面中的 CSS className 可以不用 css module, 但组件要用 css module, 或者组件 class 都取特定的名称。

  > 打包出来的文件，页面结构的跟小程序一样，但**组件是放在一个文件中的**，所以组件的 class 名称一定要区分开。

- CSS 单位，使用 px, Taro 编译的时候会转成 rpx, 默认以 750 的设计稿为准。
  > css 单位通常按照设计稿写 px 即可。不需要转成 rpx 的地方写成大写的 `PX`。  
  > **注意：** 在编辑器中格式化 scss 文件时，不要用 prettier，会把 `PX` 转成 `px`

---

## 注意

- 不使用点表示法使用组件
  > 例: `<MyComponents.Item />`
- 阻止冒泡，明确使用 `stopPropagation`

## 多端开发

https://taro-docs.jd.com/taro/docs/envs

- 跨平台开发,内置环境变量 process.env.TARO_ENV

```jsx
if (process.env.TARO_ENV === 'weapp') {
  require('path/to/weapp/name');
} else if (process.env.TARO_ENV === 'h5') {
  require('path/to/h5/name');
}
```

- 统一接口的多端文件  
  假如有一个 Test 组件存在微信小程序、百度小程序和 H5 三个不同版本，那么就可以像如下组织代码
  - test.js 文件，这是 Test 组件默认的形式，编译到微信小程序、百度小程序和 H5 三端之外的端使用的版本
  - test.h5.js 文件，这是 Test 组件的 H5 版本
  - test.weapp.js 文件，这是 Test 组件的 微信小程序 版本
  - test.swan.js 文件，这是 Test 组件的 百度小程序 版本

## MobX 状态管理

https://cn.mobx.js.org/

常用 API

- @observable 可观察的状态值
- @action 修改状态
- runInAction 异步回调修改状态
- flow 使用生成器函数, 不需要写 action 和 runInAction
- @computed 根据现有的状态或其它计算值衍生出的值。需返回新值。
- autorun （不常用）与 computed 类似，但不产生新的值

---

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

## 支付宝小程序

- 手机号授权，需配置 https://opendocs.alipay.com/mini/01xa7w
- 获取用户信息
  - “获取会员信息”功能包已升级为“获取会员基础信息”功能包
  - 基础信息 `getOpenUserInfo` https://opendocs.alipay.com/mini/introduce/twn8vq
  - 需要 `user_id`: https://opendocs.alipay.com/mini/introduce/authcode
- 商户会员卡 https://opendocs.alipay.com/mini/0137q8
- 订单 https://opendocs.alipay.com/mini/024hj4
- 小程序跳转 https://opendocs.alipay.com/mini/introduce/open-miniprogram
- mini.project.json https://opendocs.alipay.com/mini/01iols

## 其他
- H5 JSAPI https://opendocs.alipay.com/mini/quick-example/h5
