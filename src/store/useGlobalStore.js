import {
  create
} from 'zustand'

const useGlobalStore = create((set, get) => ({
  systemInfo: {},
  headerBtnPosi: {}, // bottom height left right top width
  windowWidth: 0,
  windowHeight: 0,
  statusBarHeight: 0,
  navHeight:0,
  navPadding:0,

  setSysAndMenuBtnInfo: (sysInfo, headerBtnPosi) => {
    sysInfo = sysInfo || {};
    const {
      windowWidth = 0, windowHeight = 0, statusBarHeight = 0
    } = sysInfo;

    let navHeight = get().navHeight
    let navPadding = get().navPadding

    windowWidth - (headerBtnPosi.right||0)

    if(process.env.TARO_ENV === 'weapp'){
      const { height = 0, top = 0 } = this.headerBtnPosi;
      navHeight = (top - this.statusBarHeight) * 2 + height + this.statusBarHeight;
    }else if(process.env.TARO_ENV === 'alipay'){
      navHeight = this.systemInfo.titleBarHeight
    }

    set({
      systemInfo: sysInfo,
      headerBtnPosi: headerBtnPosi || {},
      windowWidth: windowWidth,
      windowHeight: windowHeight,
      statusBarHeight: statusBarHeight,
      navHeight,
      navPadding
    })
  }
}))

export default useGlobalStore
