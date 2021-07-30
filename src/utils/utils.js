import Taro from '@tarojs/taro';

export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

export const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

export const setLocal = (key, data) => {
  Taro.setStorage({ key, data });
};

export const getLocal = (key) => {
  return Taro.getStorageSync(key);
};

export const removeLocal = (key) => {
  Taro.removeStorageSync(key);
};

export const clearLocal = () => {
  Taro.clearStorageSync();
};

// 格式化时间戳为日期
export const formatTimeStampToTime = (timestamp) => {
  const date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  // const hour = date.getHours() + ':';
  // const minutes = date.getMinutes() + ':';
  // const second = date.getSeconds();
  return `${year}-${month}-${day}`;
};

/**
 * 生成海报获取文字
 * @param string text 为传入的文本
 * @param int num 为单行显示的字节长度
 * @return array
 */
export const textByteLength = (text, num) => {
  let strLength = 0;
  let rows = 1;
  let str = 0;
  let arr = [];
  for (let j = 0; j < text.length; j++) {
    if (text.charCodeAt(j) > 255) {
      strLength += 2;
      if (strLength > rows * num) {
        strLength++;
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    } else {
      strLength++;
      if (strLength > rows * num) {
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    }
  }
  arr.push(text.slice(str, text.length));
  return [strLength, arr, rows]; //  [处理文字的总字节长度，每行显示内容的数组，行数]
};
