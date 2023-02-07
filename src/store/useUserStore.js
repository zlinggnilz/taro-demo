import { create } from 'zustand';
import { setLocal, clearLocal, getLocal } from '@/utils/utils';
import * as apis from '@/service';

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

  login: async (params) => {
    set({
      loginState: 'pending',
    });
    try {
      const { data } = await apis.login(params);

      set({
        loginState: 'done',
        userInfo: data,
        isLogin: true,
      });

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
        loginState: 'error',
      });
      return Promise.reject();
    }
  },

  logout() {
    set({
      isLogin: false,
      userInfo: {},
    });

    clearLocal(); // 清除缓存
    //
    // 清除store 中用户的其他数据
    //
  },

  setUserInfo: (info) => {
    info.name = info.nickName;
    info.uid = '001';

    set({
      userInfo: info,
    });
    setLocal('userInfo', info);
  },

  fetchList: async (params) => {
    console.log('params', params);
    set({
      // list: [],
      listState: 'pending',
    });
    try {
      const { data } = await apis.userContentList(params);
      set({
        listState: 'done',
        list: data.feedList,
      });
      return Promise.resolve();
    } catch (error) {
      set({
        listState: 'error',
      });
      return Promise.reject();
    }
  },

  publish: async (params) => {
    try {
      await apis.publish(params);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  },
}));

export default useUserStore;
