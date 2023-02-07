import request from '../utils/request';

export const login = (params) => request.post('/user/login', params);

export const userContentList = (params) => request.get('/feed/list/user', params);

export const publish = (params) => request.post('/feed/post', params);

export const homeFeedList = (params) => request.get('/feed/list/home', params);

export const commentList = (params) => request.get('/comment/list', params);

export const replyList = (params) => request.get('/reply/list', params);

export const replyPost = (params) => request.post('/comment/post', params);

export const replyComment = (params) => request.post('/reply/post', params);

export const replyCommentReply = (params) => request.post('/reply/again', params);

export const feedLike = (params) => request.post('/feed/like', params);

export const feedUnLike = (params) => request.post('/feed/unlike', params);

export const replyLike = (params) => request.post('/reply/like', params);

export const commentLike = (params) => request.post('/comment/like', params);

export const replyUnLike = (params) => request.post('/reply/unlike', params);

export const commenUntLike = (params) => request.post('/comment/unlike', params);

export const campaignList = (params) => request.post('/campaign/list', params);
