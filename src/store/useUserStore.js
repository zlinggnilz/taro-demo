import {
  create
} from 'zustand'

import {
  setLocal,
  clearLocal,
  getLocal
} from '@/utils/utils';
import request from '../utils/request';

const useUserStore = create((set, get) => ({
  isLogin: getLocal('userInfo') ? true : false,
  userInfo: getLocal('userInfo') || {},
  loginState: '', // pending, done, error
  list: [],
  listState: '',

  // isAuthUserInfo: () => {
  //   const userInfo = get().userInfo
  //   if (userInfo && Object.keys(userInfo).length > 0) {
  //     return true;
  //   }
  //   return false;
  // },

  userId: () => {
    return get().userInfo.uid
  },

  login: async (params) => {
    set({
      loginState: 'pending'
    })
    try {
      const {
        data
      } = await request.post('/user/login', params)

      set({
        loginState: 'done',
        userInfo: data,
        isLogin: true,
      })

      // setLocal('accessToken',data.accessToken);
      setLocal('accessToken', Date.now());
      setLocal('userInfo', data);

      return Promise.resolve();

      // login 返回
      // accessToken: data.accessToken,
      // mobilePhone: data.info.phone,
      // uid: data.info.uid,
    } catch (error) {
      set({
        loginState: 'error'
      })
      return Promise.reject();
    }
  },

  logout() {
    set({
      isLogin: false,
      userInfo: {},
    })

    clearLocal(); // 清除缓存
    //
    // 清除store 中用户的其他数据
    //
  },

  setUserInfo: (info) => {
    info.name = info.nickName;
    info.uid = '001';

    set({
      userInfo: info
    })
    setLocal('userInfo', info);
  },

  fetchList: async (params) => {
    console.log('params', params)
    set({
      list: [],
      listState: 'pending'
    })
    try {
      const {
        data
      } = await request.get('/feed/list/user', params);
      set({
        listState: 'done',
        list: data.feedList,
      })
      return Promise.resolve();
    } catch (error) {
      set({
        listState: 'error',
      })
      this.listState = 'error';
      return Promise.reject();
    }
  },

  publish: async (params) => {
    try {
      await request.post('/feed/post', params);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  },
}))

export default useUserStore
