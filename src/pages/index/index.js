import React, { useEffect, useCallback, useState, createRef } from 'react';
import { View, Button } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro, {
  useShareAppMessage,
  useDidShow,
  usePullDownRefresh,
  useReachBottom,
} from '@tarojs/taro';
import { AtFloatLayout, AtActionSheet, AtActionSheetItem, AtInput } from 'taro-ui';
import ListMore from '@/components/ListMore';
import List from '@/components/List';
import NavBar from '@/components/NavBar';
import UserCard from '@/components/UserCard';
import DrawCanvas from '@/components/DrawCanvas';
import PromiseAction from '@/components/PromiseAction';
import Feed from '@/components/Feed';
import Comment from '@/components/Comment';
import style from './index.module.scss';

const Index = ({ contentStore, globalStore, userStore }) => {
  const { list, listState, commentList, commentListState } = contentStore;
  const { userInfo } = userStore;

  const [commentVisible, setCommentVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [canvasVisible, setcanvasVisible] = useState(false);
  const [currentFeed, setcurrentFeed] = useState({});
  const [currentComment, setcurrentComment] = useState({});

  const [commitValue, setcommitValue] = useState('');

  const feedListRef = createRef();

  useEffect(() => {
    // contentStore.fetchList({ start: 1, length: 20 });
  }, []);

  useDidShow(() => {
    feedListRef.current.getList({ start: -1, page: 1 });
  });

  usePullDownRefresh(() => {
    feedListRef.current.getList({ start: -1, page: 1 }).finally(() => {
      Taro.stopPullDownRefresh();
    });
  });
  useReachBottom(() => {
    feedListRef.current.getList({ start: list[list.length - 1]['feedId'] });
  });

  const handleCommentFetch = useCallback((data) => {
    setcurrentFeed(data);
    setCommentVisible(true);
    contentStore.fetchCommentList({
      uid: userInfo.uid,
      feedId: data.feedId,
      start: 1,
      length: 20,
    });

    setcurrentComment({
      toUid: data.uid,
      feedId: data.feedId,
      fromUid: userInfo.uid,
    });
  }, []);

  const handleCommentClick = (data) => {
    setcurrentComment({
      toUid: data.fromUid || data.uid,
      feedId: data.feedId,
      commentId: data.commentId,
      fromUid: userInfo.uid,
      toReplyId: data.replyId,
      to: data.fromName || data.name,
    });
  };

  const handleShare = (data) => {
    setShareVisible(true);
    setcurrentFeed(data);
  };

  const renderItem = useCallback((item) => {
    return <Feed data={item} handleCommentFetch={handleCommentFetch} handleShare={handleShare} />;
  }, []);

  const handleCommentVisible = () => {
    setCommentVisible(!commentVisible);
  };

  const handleShareVisible = () => {
    setShareVisible(!shareVisible);
  };

  const handleReplyMore = (...v) => {
    return contentStore.fetchReplyList(...v);
  };

  const renderComment = (record) => {
    const content = (
      <Comment
        showAvatar
        data={record}
        avatar={record.avatar}
        key={record.feedId}
        onClick={handleCommentClick}
      ></Comment>
    );
    const reply =
      record.replyList && record.replyList.length ? (
        <View className={style.replyWrap}>
          {record.replyList.map((item) => {
            item.commentId = record.commentId;
            return (
              <Comment
                showAvatar={false}
                className={style.commentSub}
                data={item}
                name={item.fromName}
                // avatar={item.fromAvatarUrl}
                key={item.replyId}
                onClick={handleCommentClick}
              ></Comment>
            );
          })}
          <PromiseAction
            className={style.replyMore}
            onClick={() =>
              handleReplyMore({
                uid: userInfo.uid,
                commentId: record.commentId,
                start: record.replyList[record.replyList.length - 1],
                length: 20,
              })
            }
          >
            更多
          </PromiseAction>
        </View>
      ) : null;

    return (
      <>
        {content}
        {reply}
      </>
    );
  };

  const handleSaveImg = () => {
    setcanvasVisible(true);
    setShareVisible(false);
  };

  useShareAppMessage((res) => {
    let img = '../../assets/login.png';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      img = res.target.dataset.img;
    }
    return {
      title: '今天出太阳',
      path: '/pages/index/index',
      imageUrl: img,
    };
  });

  const canvasCancel = useCallback(() => {
    setcanvasVisible(false);
  }, []);

  const handleCommitValue = (v) => {
    setcommitValue(v);
  };

  const handleSendCommit = () => {
    const text = (commitValue || '').trim();
    if (!text) {
      Taro.showToast({ title: '评论内容不能为空', icon: 'none' });
      return;
    }

    const params = { ...currentComment, text: commitValue, feedId: currentFeed.feedId };

    let action;

    if (currentComment.toReplyId) {
      action = contentStore.replyCommentReply;
      // action = 'replyCommentReply';
    } else if (currentComment.commentId) {
      action = contentStore.replyComment;
      // action = 'replyComment';
    } else {
      action = contentStore.replyPost;
      // action = 'replyPost';
    }

    return action(params).then(() => {
      Taro.showToast({ title: '评论成功', icon: 'none' });
      setcommitValue('');
    });
  };

  return (
    <>
      <NavBar title="首页" leftContent={<UserCard></UserCard>}></NavBar>

      <View style={{ marginTop: globalStore.navHeight }} className="container">
        <ListMore
          ref={feedListRef}
          dataSource={list}
          renderItem={renderItem}
          state={listState}
          loadingCenter={false}
          fetchList={contentStore.fetchList}
          pageData={contentStore.listPage}
        />
      </View>
      <AtFloatLayout
        className={style.commentWrap}
        isOpened={commentVisible}
        title="评论"
        onClose={handleCommentVisible}
      >
        <View className={style.commentList}>
          <List renderItem={renderComment} dataSource={commentList} state={commentListState} />
        </View>
        <View className={`flex align-stretch ${style.commitWrap}`}>
          <View className={style.commitAvatar}>
            <open-data type="userAvatarUrl"></open-data>
          </View>
          <View className={`flex-box ${style.commitInput}`}>
            <AtInput
              type="text"
              placeholder={`评论${currentComment.to ? '@' + currentComment.to : ''}`}
              value={commitValue}
              onChange={handleCommitValue}
            ></AtInput>
          </View>
          <PromiseAction onClick={handleSendCommit} className={style.commitBtn} color="white">
            发送
          </PromiseAction>
        </View>
      </AtFloatLayout>

      <View className={style.actionSheet}>
        <AtActionSheet
          isOpened={shareVisible}
          onCancel={handleShareVisible}
          onClose={handleShareVisible}
        >
          <AtActionSheetItem className={style.actionItem}>
            <View className="at-icon at-icon-user"></View>微信好友
            <Button openType="share" data-img={currentFeed.imageUrl}></Button>
          </AtActionSheetItem>
          <AtActionSheetItem className={style.actionItem} onClick={handleSaveImg}>
            <View className="at-icon at-icon-image"></View>保存图片
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
      <DrawCanvas
        isOpened={canvasVisible}
        imageUrl={currentFeed.imageUrl}
        onCancel={canvasCancel}
        data={currentFeed}
      />
    </>
  );
};

export default inject('contentStore', 'globalStore', 'userStore')(observer(Index));
