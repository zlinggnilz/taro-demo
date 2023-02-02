import { observable, action, runInAction, flow } from 'mobx';
import request from '../utils/request';

class Content {
  @observable list = [];
  @observable listPage = {};
  @observable listState = ''; // pending, done, error


  @action.bound
  async fetchList(params) {
    // this.list = [];
    this.listState = 'pending';
    try {
      const { data } = await request.post('/campaign/list', params);
      runInAction(() => {
        this.listState = 'done';
        if (params.page === 1) {
          this.list = data.list;
        } else {
          this.list = [...this.list, ...data.list];
        }
        this.listPage = { page: data.pageNo, totalPage:data.totalPage };
      });
      return Promise.resolve(data.list);
    } catch (error) {
      runInAction(() => {
        this.listState = 'error';
      });
      return Promise.reject(error);
    }
  }


}

export default new Content();
