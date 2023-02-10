import { useState } from 'react';
import { View, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtImagePicker, AtButton } from 'taro-ui';
import ModalSelect from '@/components/ModalSelect';
import Tags from '@/components/Tags';
import useUserStore from '@/store/useUserStore';
import { shallow } from 'zustand/shallow';
import './index.scss';

const tagList = [
  { value: 'tag1', label: 'Tag - 1' },
  { value: 'tag2', label: 'Tag - 2' },
  { value: 'tag3', label: 'Tag - 3' },
  { value: 'tag4', label: 'Tag - 4' },
  { value: 'tag5', label: 'Tag - 5' },
  { value: 'tag6', label: 'Tag - 6' },
  { value: 'tag7', label: 'Tag - 7' },
  { value: 'tag8', label: 'Tag - 8' },
  { value: 'tag9', label: 'Tag - 9' },
  { value: 'tag10', label: 'Tag - 10' },
  { value: 'tag11', label: 'Tag - 11' },
  { value: 'tag12', label: 'Tag - 12' },
  { value: 'tag13', label: 'Tag - 13' },
  { value: 'tag14', label: 'Tag - 14' },
  { value: 'tag15', label: 'Tag - 15' },
  { value: 'tag16', label: 'Tag - 16' },
  { value: 'tag17', label: 'Tag - 17' },
  { value: 'tag18', label: 'Tag - 18' },
  { value: 'tag19', label: 'Tag - 19' },
  { value: 'tag20', label: 'Tag - 20' },
];

const Publish = () => {
  const { userInfo, publish } = useUserStore(
    (state) => ({ userInfo: state.userInfo, publish: state.publish }),
    shallow
  );

  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAddBtn, setshowAddBtn] = useState(true);
  const [modalVisible, setmodalVisible] = useState(false);
  const [publishLoading, setpublishLoading] = useState(false);

  const handleImgChange = (fs) => {
    setFiles(fs);
    if (fs.length) {
      setshowAddBtn(false);
    } else {
      setshowAddBtn(true);
    }
  };

  const uploadImg = () => {
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: 'https://testurl',
        filePath: files[0].url,
        name: 'file',
        // formData: {
        //   'user': 'test'
        // },
        success(res) {
          const data = res.data;
          resolve(data.uri);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  };

  const handleTextChange = (e) => {
    setText(e.detail.value || '');
  };

  const handlePublish = async () => {
    if (!text.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    if (!files.length) {
      Taro.showToast({ title: '请选择图片', icon: 'none' });
      return;
    }

    if (!selectedTags.length) {
      Taro.showToast({ title: '请选择标签', icon: 'none' });
      return;
    }

    setpublishLoading(true);

    // 先上传图片
    // const imgUrl = await uploadImg();

    publish({
      tagIds: selectedTags.join(','),
      uid: userInfo.uid,
      text: text.trim(),
      imageUrl: files[0].url,
    })
      .then(() => {
        setpublishLoading(false);

        Taro.navigateBack();
        Taro.showToast({ title: '发布成功', icon: 'none' });
      })
      .catch(() => {
        setpublishLoading(false);

        Taro.showToast({ title: '发布失败', icon: 'none' });
      });
  };

  const handleTagChange = (v) => {
    setSelectedTags(v);
  };
  const handleShowTagsModal = () => {
    setmodalVisible(!modalVisible);
  };

  return (
    <View className='container'>
      <Textarea
        className='text'
        placeholder='输入内容'
        placeholderClass='placeholder'
        onInput={handleTextChange}
      ></Textarea>
      <View className='tagWrap'>
        <Tags value={selectedTags} dataSource={tagList} onChange={handleTagChange} />
        <View onClick={handleShowTagsModal} className='selectTagbtn'>
          选择标签
        </View>
      </View>
      <View className='imgWrap'>
        <AtImagePicker
          multiple={false}
          count={1}
          length={3}
          showAddBtn={showAddBtn}
          files={files}
          onChange={handleImgChange}
        />
      </View>

      <View className='btnWrap'>
        <AtButton circle type='primary' onClick={handlePublish} loading={publishLoading}>
          发布
        </AtButton>
      </View>

      <ModalSelect
        isOpened={modalVisible}
        value={selectedTags}
        onChange={handleTagChange}
        onCancel={handleShowTagsModal}
        dataSource={tagList}
      />
    </View>
  );
};

export default Publish;
