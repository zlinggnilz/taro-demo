import Taro from '@tarojs/taro';

const fsm = Taro.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

function base64src(base64data, cb) {
  const v = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  const [, format, bodyData] = v;
  if (!format) {
    return new Error('ERROR_BASE64SRC_PARSE');
  }
  const filePath = `${Taro.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
  const buffer = Taro.base64ToArrayBuffer(bodyData);
  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success() {
      cb(filePath);
    },
    fail(err) {
      console.log('🚀 ~ file: base64.js >>>>', err);
      return new Error('ERROR_BASE64SRC_WRITE');
    },
  });
}

export default base64src;
