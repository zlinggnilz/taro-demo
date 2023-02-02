import { observable, action, flow, computed } from 'mobx';
import { setLocal, clearLocal, getLocal } from '@/utils/utils';
import request from '../utils/request';

class User {
  @observable isLogin = getLocal('userInfo')?true:false; // 缓存中是否有 access token
  // @observable isLogin = false; // 缓存中是否有 access token
  @observable userInfo = getLocal('userInfo') || {};
  // @observable userInfo = { uid: '001', name: 'test name' };
  @observable loginState = ''; // pending, done, error
  @observable list = [];
  @observable listState = ''; // pending, done, error

  @computed
  get isAuthUserInfo() {
    if (this.userInfo && Object.keys(this.userInfo).length > 0) {
      return true;
    }
    return false;
  }

  @computed
  get userId(){
    return this.userInfo.uid
  }

  login = flow(
    function* (params) {
      this.loginState = 'pending';
      try {
        const { data } = yield request.post('/user/login', params);
        console.log("🚀 ~ file: user.js:32 ~ User ~ data", data)
        this.loginState = 'done';
        this.userInfo = data;
        this.isLogin = true;

        // setLocal('accessToken',data.accessToken);
        setLocal('accessToken', Date.now());
        setLocal('userInfo', data);

        return Promise.resolve();

        // login 返回
        // accessToken: data.accessToken,
        // mobilePhone: data.info.phone,
        // uid: data.info.uid,
      } catch (error) {
        this.loginState = 'error';
        return Promise.reject();
      }
    }.bind(this)
  );

  @action.bound
  logout() {
    this.isLogin = false;
    this.userInfo = {};
    clearLocal(); // 清除缓存
    //
    // 清除store 中用户的其他数据
    //
  }

  @action.bound
  setUserInfo(info) {
    info.name = info.nickName;
    info.uid = '001';
    this.userInfo = info;
    setLocal('userInfo', info);
  }

  fetchList = flow(
    function* (params) {
      console.log('params',params)
      this.list = [];
      this.listState = 'pending';
      try {
        const { data } = yield request.get('/feed/list/user', params);
        this.listState = 'done';
        this.list = data.feedList;
        return Promise.resolve();
      } catch (error) {
        this.listState = 'error';
        return Promise.reject();
      }
    }.bind(this)
  );
  publish = flow(
    function* (params) {
      try {
        yield request.post('/feed/post', params);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      }
    }.bind(this)
  );
}

export default new User();
