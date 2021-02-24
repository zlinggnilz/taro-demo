import { observable, action, runInAction, flow } from 'mobx';
import request from '../utils/request';

class Content {
  @observable list = [];
  @observable listPage = { page: 0 };
  @observable listState = ''; // pending, done, error
  @observable commentList = [];
  @observable commentListState = ''; // pending, done, error

  @action.bound
  async fetchList(params) {
    // this.list = [];
    this.listState = 'pending';
    try {
      const { data } = await request.get('/feed/list/home', params);
      runInAction(() => {
        this.listState = 'done';
        if (params.page === 1) {
          this.list = data.feedList;
        } else {
          this.list = [...this.list, ...data.feedList];
        }
        this.listPage = { page: params.page };
      });
      return Promise.resolve(data.feedList);
    } catch (error) {
      runInAction(() => {
        this.listState = 'error';
      });
      return Promise.reject(error);
    }
  }

  fetchCommentList = flow(function* (params) {
    this.commentList = [];
    this.commentListState = 'pending';
    try {
      const { data } = yield request.get('/comment/list', params);
      this.commentListState = 'done';
      this.commentList = data.commentList;
    } catch (error) {
      this.commentListState = 'error';
    }
  });
  fetchReplyList = flow(function* (params) {
    try {
      const { data } = yield request.get('/reply/list', params);
      this.commentList = this.commentList.map((item) => {
        if (item.commentId === params.commentId) {
          return { ...item, replyList: [...item.replyList, ...data.replyList] };
        }
        return item;
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  });

  replyPost = flow(
    function* (params) {
      try {
        const { data } = yield request.post('/comment/post', params);
        this.commentList = [data, ...this.commentList];
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }.bind(this)
  );
  replyComment = flow(
    function* (params) {
      try {
        const { data } = yield request.post('/reply/post', params);
        this.commentList = this.commentList.map((item) => {
          if (item.commentId === params.commentId) {
            item.replyList = [data, ...item.replyList];
          }
          return item;
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }.bind(this)
  );
  replyCommentReply = flow(
    function* (params) {
      try {
        const { data } = yield request.post('/reply/again', params);
        this.commentList = this.commentList.map((item) => {
          if (item.commentId === params.commentId) {
            item.replyList = [data, ...item.replyList];
          }
          return item;
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }.bind(this)
  );

  feedLike = flow(function* (params) {
    try {
      yield request.post('/feed/like', params);
      this.list = this.list.map((item) => {
        if (item.feedId === params.feedId) {
          return { ...item, isLike: 1, like_count: item.like_count + 1 };
        }
        return item;
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }.bind(this));
  feedUnLike = flow(function* (params) {
    try {
      yield request.post('/feed/unlike', params);
      this.list = this.list.map((item) => {
        if (item.feedId === params.feedId) {
          return { ...item, isLike: 0, like_count: item.like_count - 1 };
        }
        return item;
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }.bind(this));
  commentLike = flow(function* (params) {
    try {
      const url = params.replyId ? '/reply/like' : '/comment/like';
      yield request.post(url, params);
      this.commentList = this.commentList.map((item) => {
        if (item.commentId === params.commentId) {
          if (!params.replyId) {
            return { ...item, isLike: 1, like_count: item.like_count + 1 };
          } else {
            item.replyList = item.replyList.map((subItem) => {
              if (subItem.replyId === params.replyId) {
                return { ...subItem, isLike: 1, like_count: subItem.like_count + 1 };
              }
              return subItem;
            });
          }
        }
        return item;
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }.bind(this));
  commentUnLike = flow(function* (params) {
    try {
      const url = params.replyId ? '/reply/unlike' : '/comment/unlike';
      yield request.post(url, params);
      this.commentList = this.commentList.map((item) => {
        if (item.commentId === params.commentId) {
          if (!params.replyId) {
            return { ...item, isLike: 0, like_count: item.like_count - 1 };
          } else {
            item.replyList = item.replyList.map((subItem) => {
              if (subItem.replyId === params.replyId) {
                return { ...subItem, isLike: 0, like_count: subItem.like_count - 1 };
              }
              return subItem;
            });
          }
        }
        return item;
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }.bind(this));
}

export default new Content();
