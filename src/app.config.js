export default {
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/user/index',
    'pages/userContent/index',
    'pages/userPublish/index',
    'pages/campaign/index',
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    enableComponentOverlayer: 'YES',
  },
  lazyCodeLoading: 'requiredComponents',
  tabBar: {
    custom: true,
    color: '#000000',
    selectedColor: '#DC143C',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath: 'assets/tab-icons/home-on.png',
        iconPath: 'assets/tab-icons/home.png',
        text: '首页'
      },
      {
        pagePath: 'pages/user/index',
        selectedIconPath: 'assets/tab-icons/user-on.png',
        iconPath: 'assets/tab-icons/user.png',
        text: '个人中心'
      },
      {
        pagePath: 'pages/userContent/index',
        selectedIconPath: 'assets/tab-icons/published-on.png',
        iconPath: 'assets/tab-icons/published.png',
        text: '我的发布'
      },
      {
        pagePath: 'pages/campaign/index',
        selectedIconPath: 'assets/tab-icons/campaign-on.png',
        iconPath: 'assets/tab-icons/campaign.png',
        text: '活动'
      }
    ]
  }
};
