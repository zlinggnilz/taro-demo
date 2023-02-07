import {
  create
} from 'zustand'
import request from '../utils/request';

const useContentStore = create((set, get) => ({
  list: [],
  listPage: {
    page: 0
  },
  listState: '', // pending, done, error
  commentList: [],
  commentListState: '', // pending, done, error

  fetchList: async (params) => {
    // this.list = [];
    set({
      listState: 'pending'
    })
    try {
      const {
        data
      } = await request.get('/feed/list/home', params);

      const listState = 'done';
      let list = get().list
      if (params.page === 1) {
        list = data.feedList;
      } else {
        list = [...list, ...data.feedList];
      }
      const listPage = {
        page: params.page
      };

      set({
        listState,
        list,
        listPage
      })

      return Promise.resolve(data.feedList);
    } catch (error) {
      set({
        listState: 'error'
      })
      return Promise.reject(error);
    }
  },

  fetchCommentList: async (params) => {

    set({
      commentList: [],
      commentListState: 'pending',
    })
    try {
      const {
        data
      } = await request.get('/comment/list', params);
      set({
        commentList: data.commentList,
        commentListState: 'done',
      })
    } catch (error) {
      set({
        commentListState: 'error',
      })
    }
  },

  fetchReplyList: async (params) => {
    try {
      const {
        data
      } = await request.get('/reply/list', params);

      let commentList = get().commentList
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          return {
            ...item,
            replyList: [...item.replyList, ...data.replyList]
          };
        }
        return item;
      });

      set({
        commentList
      })

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  replyPost: async (params) => {
    try {
      const {
        data
      } = await request.post('/comment/post', params);
      this.commentList = [data, ...this.commentList];
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  replyComment: async (params) => {
    try {
      const {
        data
      } = await request.post('/reply/post', params);
      let commentList = get().commentList
      commentList = this.commentList.map((item) => {
        if (item.commentId === params.commentId) {
          item.replyList = [data, ...item.replyList];
        }
        return item;
      });
      set({
        commentList
      })
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  replyCommentReply: async (params) => {
    try {
      const {
        data
      } = await request.post('/reply/again', params);
      let commentList = get().commentList
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          item.replyList = [data, ...item.replyList];
        }
        return item;
      });
      set({
        commentList
      })
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  feedLike: async (params) => {
    try {
      await request.post('/feed/like', params);
      let list = get().list
      list = list.map((item) => {
        if (item.feedId === params.feedId) {
          return {
            ...item,
            isLike: 1,
            like_count: item.like_count + 1
          };
        }
        return item;
      });
      set({
        list
      })
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  feedUnLike: async (params) => {
    try {
      await request.post('/feed/unlike', params);
      let list = get().list
      list = list.map((item) => {
        if (item.feedId === params.feedId) {
          return {
            ...item,
            isLike: 0,
            like_count: item.like_count - 1
          };
        }
        return item;
      });
      set({
        list
      })
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  commentLike: async (params) => {
    try {
      const url = params.replyId ? '/reply/like' : '/comment/like';
      await request.post(url, params);
      let commentList = get().commentList
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          if (!params.replyId) {
            return {
              ...item,
              isLike: 1,
              like_count: item.like_count + 1
            };
          } else {
            item.replyList = item.replyList.map((subItem) => {
              if (subItem.replyId === params.replyId) {
                return {
                  ...subItem,
                  isLike: 1,
                  like_count: subItem.like_count + 1
                };
              }
              return subItem;
            });
          }
        }
        return item;
      });
      set({
        commentList
      })
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  commentUnLike: async (params) => {
    try {
      const url = params.replyId ? '/reply/unlike' : '/comment/unlike';
      await request.post(url, params);
      let commentList = get().commentList
      commentList = commentList.map((item) => {
        if (item.commentId === params.commentId) {
          if (!params.replyId) {
            return {
              ...item,
              isLike: 0,
              like_count: item.like_count - 1
            };
          } else {
            item.replyList = item.replyList.map((subItem) => {
              if (subItem.replyId === params.replyId) {
                return {
                  ...subItem,
                  isLike: 0,
                  like_count: subItem.like_count - 1
                };
              }
              return subItem;
            });
          }
        }
        return item;
      });
      set({
        commentList
      })
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

}))

export default useContentStore
