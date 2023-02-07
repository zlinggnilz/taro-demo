import {
  create
} from 'zustand'
import request from '../utils/request';


const useCampaignStore = create((set, get) => ({
  list: [],
  listPage: {},
  listState: '', // pending, done, error

  fetchList: async (params) => {
    // this.list = [];
    set({
      listState: 'pending'
    })
    try {
      const {
        data
      } = await request.post('/campaign/list', params);

      const listState = 'done';
      let list = get().list
      if (params.page === 1) {
        list = data.list;
      } else {
        list = [...list, ...data.list];
      }
      const listPage = {
        page: data.pageNo,
        totalPage: data.totalPage
      };

      set({
        listState,
        listPage,
        list
      })

      return Promise.resolve(data.list);
    } catch (error) {
      set({
        listState: 'error'
      })
      return Promise.reject(error);
    }
  }
}))

export default useCampaignStore
