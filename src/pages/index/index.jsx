import  { useCallback, useState, createRef, useMemo,memo } from 'react';
import { View, Button, Image,Input } from '@tarojs/components';
import Taro, {
  useShareAppMessage,
  useDidShow,
  usePullDownRefresh,
  useReachBottom
} from '@tarojs/taro';
import { AtFloatLayout, AtActionSheet, AtActionSheetItem } from 'taro-ui';
import ListMore from '@/components/ListMore';
import List from '@/components/List';
import NavBar from '@/components/NavBar';
import UserCard from '@/components/UserCard/index';
import DrawCanvas from '@/components/DrawCanvas';
import PromiseAction from '@/components/PromiseAction';
import Feed from '@/components/Feed';
import Comment from '@/components/Comment';
// import { feedImg } from '@/constant';
import ContentImg from '@/assets/where.jpg';
import shallow from 'zustand/shallow'
import useUserStore from '@/store/useUserStore';
import useGlobalStore from '@/store/useGlobalStore';
import useContentStore from '@/store/useContentStore';

import style from './index.module.scss';

const Index = () => {

  const { list, listState, commentList, commentListState,fetchCommentList ,fetchReplyList,fetchList,listPage,replyCommentReply,replyComment,replyPost} = useContentStore(state=>({list:state.list, listState:state.listState, commentList:state.commentList, commentListState:state.commentListState,fetchCommentList:state.fetchCommentList ,fetchReplyList:state.fetchReplyList,fetchList:state.fetchList, listPage:state.listPage,replyCommentReply:state.replyCommentReply, replyComment:state.replyComment,replyPost:state.replyPost }),shallow);

  const {userInfo,userId} = useUserStore(state=>({userInfo:state.userInfo, userId: state.userId}),shallow)

  const { navHeight,statusBarHeight} = useGlobalStore(state=>({navHeight:state.navHeight,statusBarHeight:state.statusBarHeight}),shallow)


  const [commentVisible, setCommentVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [canvasVisible, setcanvasVisible] = useState(false);
  const [currentFeed, setcurrentFeed] = useState({});
  const [currentComment, setcurrentComment] = useState({});

  const [commitValue, setcommitValue] = useState('');

  const feedListRef = createRef();

  const mt = useMemo(() => {
    if (process.env.TARO_ENV === 'alipay') {
      return navHeight + statusBarHeight;
    }
    if (process.env.TARO_ENV === 'weapp') {
      return navHeight;
    }
  }, []);

  const pageCtx = useMemo(() => Taro.getCurrentInstance().page, []);

  useDidShow(() => {
    feedListRef.current.getList({ start: -1, page: 1 });
    const tabbar = Taro.getTabBar(pageCtx)
    tabbar?.setSelected('home')
  });

  // useEffect(() => {
    // fetchList({ start: 1, length: 20 });
    // console.log(globalStore);
    // if (process.env.TARO_ENV === 'alipay') {
    //   my.setNavigationBar({
    //     title: '首页alipay',
    //     backgroundColor: '#ffffff',
    //     // borderBottomColor,
    //     image: 'https://gz.bcebos.com/v1/newretail/df3i/pyq-share.png',
    //   });
    // }
  // }, []);


  usePullDownRefresh(() => {
    feedListRef.current.getList({ start: -1, page: 1 }).finally(() => {
      Taro.stopPullDownRefresh();
    });
  });
  useReachBottom(() => {
    feedListRef.current.getList({ start: list[list.length - 1]['feedId'] });
  });

  const handleCommentFetch = (data) => {
    setcurrentFeed(data);
    setCommentVisible(true);
    const uid = userId;
    fetchCommentList({
      uid,
      feedId: data.feedId,
      start: 1,
      length: 20,
    });

    setcurrentComment({
      toUid: data.uid,
      feedId: data.feedId,
      fromUid: uid,
    });
  };

  const handleCommentClick = (data) => {
    setcurrentComment({
      toUid: data.fromUid || data.uid,
      feedId: data.feedId,
      commentId: data.commentId,
      fromUid: userId,
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
    return fetchReplyList(...v);
  };

  const renderComment = (record) => {
    const content = (
      <Comment
        showAvatar
        data={record}
        avatar={record.avatar || record.fromAvatarUrl}
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
                uid: userId,
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
    setcommitValue(v.detail.value);
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
      action = replyCommentReply;
      // action = 'replyCommentReply';
    } else if (currentComment.commentId) {
      action = replyComment;
      // action = 'replyComment';
    } else {
      action = replyPost;
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

      <View style={{ marginTop: mt }} className="container">
        {/* <View className="container"> */}
        <ListMore
          ref={feedListRef}
          dataSource={list}
          renderItem={renderItem}
          state={listState}
          loadingCenter={false}
          fetchList={fetchList}
          pageData={listPage}
        />
      </View>
      <AtFloatLayout
        isOpened={commentVisible}
        title="评论"
        onClose={handleCommentVisible}
      >
        <View className={style.commentList}>
          <List renderItem={renderComment} dataSource={commentList} state={commentListState} />
        </View>
        <View className={`flex align-stretch ${style.commitWrap}`}>
          <Image src={userInfo.avatar} className={style.commitAvatar}></Image>
          <View className={`flex-box ${style.commitInputWrap}`}>
            <Input className={style.commitInput}
              type='text'
              placeholder={`评论${currentComment.to ? '@' + currentComment.to : ''}`}
              placeholderStyle='color:#888'
              value={commitValue}
              onInput={handleCommitValue}
            />
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
            <Button openType="share" data-img={ContentImg}></Button>
          </AtActionSheetItem>
          <AtActionSheetItem className={style.actionItem} onClick={handleSaveImg}>
            <View className="at-icon at-icon-image"></View>保存图片
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
      <DrawCanvas
        isOpened={canvasVisible}
        // imageUrl={feedImg}
        onCancel={canvasCancel}
        data={currentFeed}
      />
    </>
  );
};

export default (Index);
