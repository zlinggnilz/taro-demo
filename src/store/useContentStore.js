import { create } from 'zustand';
import * as apis from '@/service';

const useContentStore = create((set, get) => ({
  list: [],
  listPage: {
    page: 0,
  },
  listState: '', // pending, done, error
  commentList: [],
  commentListState: '', // pending, done, error

  fetchList: async (params) => {
    //
    set({
      // list:[],
      listState: 'pending',
    });
    try {
      const { data } = await apis.homeFeedList(params);

      const listState = 'done';
      let list = get().list;
      if (params.page === 1) {
        list = data.feedList;
      } else {
        list = [...list, ...data.feedList];
      }
      const listPage = {
        page: params.page,
      };

      set({
        listState,
        list,
        listPage,
      });

      return Promise.resolve(data.feedList);
    } catch (error) {
      set({
        listState: 'error',
      });
      return Promise.reject(error);
    }
  },

  fetchCommentList: async (params) => {
    set({
      commentList: [],
      commentListState: 'pending',
    });
    try {
      const { data } = await apis.commentList(params);
      set({
        commentList: data.commentList,
        commentListState: 'done',
      });
    } catch (error) {
      set({
        commentListState: 'error',
      });
    }
  },

  fetchReplyList: async (params) => {
    try {
      const { data } = await apis.replyList(params);

      let commentList = get().commentList;
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          return {
            ...item,
            replyList: [...item.replyList, ...data.replyList],
          };
        }
        return item;
      });

      set({
        commentList,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  replyPost: async (params) => {
    let commentList = get().commentList;
    try {
      const { data } = await apis.replyPost(params);
      commentList = [data, ...commentList];
      set(commentList);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  replyComment: async (params) => {
    try {
      const { data } = await apis.replyComment(params);
      let commentList = get().commentList;
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          item.replyList = [data, ...item.replyList];
        }
        return item;
      });
      set({
        commentList,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  replyCommentReply: async (params) => {
    try {
      const { data } = await apis.replyCommentReply(params);
      let commentList = get().commentList;
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          item.replyList = [data, ...item.replyList];
        }
        return item;
      });
      set({
        commentList,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  feedLike: async (params) => {
    try {
      await apis.feedLike(params);
      let list = get().list;
      list = list.map((item) => {
        if (item.feedId === params.feedId) {
          return {
            ...item,
            isLike: 1,
            like_count: item.like_count + 1,
          };
        }
        return item;
      });
      set({
        list,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  feedUnLike: async (params) => {
    try {
      await apis.feedUnLike(params);
      let list = get().list;
      list = list.map((item) => {
        if (item.feedId === params.feedId) {
          return {
            ...item,
            isLike: 0,
            like_count: item.like_count - 1,
          };
        }
        return item;
      });
      set({
        list,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  commentLike: async (params) => {
    try {
      const action = params.replyId ? apis.replyLike : apis.commentLike;
      await action(params);
      let commentList = get().commentList;
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          if (!params.replyId) {
            return {
              ...item,
              isLike: 1,
              like_count: item.like_count + 1,
            };
          } else {
            item.replyList = item.replyList.map((subItem) => {
              if (subItem.replyId === params.replyId) {
                return {
                  ...subItem,
                  isLike: 1,
                  like_count: subItem.like_count + 1,
                };
              }
              return subItem;
            });
          }
        }
        return item;
      });
      set({
        commentList,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  commentUnLike: async (params) => {
    try {
      const action = params.replyId ? apis.replyUnLike : apis.commenUntLike;
      await action(params);
      let commentList = get().commentList;
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          if (!params.replyId) {
            return {
              ...item,
              isLike: 0,
              like_count: item.like_count - 1,
            };
          } else {
            item.replyList = item.replyList.map((subItem) => {
              if (subItem.replyId === params.replyId) {
                return {
                  ...subItem,
                  isLike: 0,
                  like_count: subItem.like_count - 1,
                };
              }
              return subItem;
            });
          }
        }
        return item;
      });
      set({
        commentList,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
}));

export default useContentStore;
