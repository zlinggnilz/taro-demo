import { create } from 'zustand';
import * as apis from '@/service';

const useCampaignStore = create((set, get) => ({
  list: [],
  listPage: {},
  listState: '', // pending, done, error

  fetchList: async (params) => {
    set({
      // list:[],
      listState: 'pending',
    });
    try {
      const { data } = await apis.campaignList(params);

      const listState = 'done';
      let list = get().list;
      if (params.page === 1) {
        list = data.list;
      } else {
        list = [...list, ...data.list];
      }
      const listPage = {
        page: data.pageNo,
        totalPage: data.totalPage,
      };

      set({
        listState,
        listPage,
        list,
      });

      return Promise.resolve(data.list);
    } catch (error) {
      set({
        listState: 'error',
      });
      return Promise.reject(error);
    }
  },
}));

export default useCampaignStore;
