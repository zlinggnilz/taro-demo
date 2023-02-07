import React, { useState ,useEffect} from 'react';
import {  Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtCheckbox } from 'taro-ui';

const ModalSelect = ({ dataSource=[], isOpened, value, onChange,onCancel }) => {
  const [selectList, setselectList] = useState(value || []);

  useEffect(() => {

    if(isOpened){
      setselectList(value || []);
    }

  }, [isOpened])

  const handleSelectChange = (v) => {
    setselectList(v);
  };

  const handleOk = () => {
    onChange && onChange(selectList);
    onCancel && onCancel()

  };

  const handleCancel = () => {
    setselectList(value || []);
    onCancel && onCancel()
  };

  return (
    <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
      <AtModalHeader>选择标签</AtModalHeader>
      <AtModalContent>
        <AtCheckbox options={dataSource} selectedList={selectList} onChange={handleSelectChange} />
      </AtModalContent>
      <AtModalAction>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={handleOk}>确定</Button>
      </AtModalAction>
    </AtModal>
  );
};

export default ModalSelect;
