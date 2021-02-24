import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Canvas } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';
import logoImg from '@/assets/login.png';
import base64src from '@/utils/base64';
import { textByteLength } from '@/utils/utils';
import style from './index.module.scss';
import qrcode from './qrcode';

let baseUrlCode = '';
const DrawCanvas = (props) => {
  const { isOpened, imageUrl, onCancel, data } = props;

  const [canvasInfo, setcanvasInfo] = useState({ width: 560, height: 978 });

  const imgTempPath = useRef('');
  const [posterImage, setposterImage] = useState('');

  useEffect(() => {
    base64src(qrcode, (res) => {
      baseUrlCode = res;
    });
  }, []);

  useEffect(() => {
    if (!isOpened) {
      setposterImage('');
      return;
    }
    // Taro.getSystemInfo().then((res) => {
    //   setcanvasInfo({
    //     width:res.windowWidth * 2,
    //     height:res.windowHeight * 2
    //   })
    // });
    start();
  }, [isOpened]);

  // 下载网络图片
  const downLoad = () => {
    return new Promise((resolve, reject) => {
      Taro.showLoading();
      Taro.downloadFile({
        url: imageUrl,
        success: function (res) {
          imgTempPath.current = res.tempFilePath;
          Taro.hideLoading();
          resolve();
        },
        fail: function (res) {
          Taro.hideLoading();
          Taro.showToast({
            title: '生成失败',
            icon: 'none',
          });
          reject();
        },
      });
    });
  };

  // 绘制图片
  const wxDrawImage = () => {
    return new Promise((resolve, reject) => {
      try {
        Taro.showLoading({ title: '图片生成中', mask: true });
        const WIDTH = canvasInfo.width;
        var ctx = Taro.createCanvasContext('shareCanvas');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, WIDTH, canvasInfo.height);
        ctx.clearRect(0, 0, 0, 0);
        Taro.getImageInfo({ src: imgTempPath.current }).then((res) => {
          // 获取图片的高度
          const IMAGEHEIGHT = res.height;
          const IMAGEWIDTH = res.width;

          // ctx.drawImage(logoImg, (WIDTH - 300) / 2, 20, 300, 300);
          // ctx.restore();

          ctx.setFillStyle('#333333'); //  颜色
          ctx.setFontSize(38);
          let str1 = data.name;
          let left1 = (WIDTH - ctx.measureText(str1).width) / 2;
          ctx.fillText(str1, left1, 60 + 38); //字体加设计高度

          // ctx.fillStyle = '#D8D8D8';
          // ctx.fillRect(0, 152, WIDTH, 560);
          // ctx.clearRect(0, 0, 0, 0);
          const imgH = WIDTH;
          const imgW = (IMAGEHEIGHT * imgH) / IMAGEWIDTH;

          ctx.drawImage(
            imgTempPath.current,
            (WIDTH - imgW) / 2,
            152 + (560 - imgH) / 2,
            imgW,
            imgH
          );
          ctx.restore();

          let str2 = data.text;
          let [contentLeng, contentArray, contentRows] = textByteLength(str2, 36);
          let hs = contentRows * 48;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.setFillStyle('#ffffff');
            ctx.setTextAlign('left');
            ctx.font = 'normal bold 28px sans-serif';
            ctx.fillText(contentArray[m], 32, 152 + 52 + 48 * m);
          }

          // 图片转码
          ctx.drawImage(baseUrlCode, WIDTH - 160 - 32, 754, 160, 160);
          ctx.restore();

          ctx.setFillStyle('#333333'); //  颜色
          ctx.setFontSize(32);
          let str4 = '长按识别二维码';
          ctx.font = 'normal normal 26px sans-serif';
          ctx.fillText(str4, 32, 754 + 80 + 16);

          ctx.draw(true, resolve);
        });
      } catch (error) {
        Taro.hideLoading();
        reject();
      }
    });
  };

  // 图片临时保存
  const saveTempImage = () => {
    Taro.canvasToTempFilePath({
      width: canvasInfo.width,
      height: canvasInfo.height,
      destWidth: canvasInfo.width * 2,
      destHeight: canvasInfo.height * 2,
      x: 0,
      y: 0,
      canvasId: 'shareCanvas',
      success: function (res) {
        Taro.hideLoading();
        setposterImage(res.tempFilePath);
      },
    });
  };

  const start = async () => {
    await downLoad();
    await wxDrawImage();
    saveTempImage();
  };

  // 获取微信相册授权信息
  const getSetting = () => {
    return new Promise((resolve, reject) => {
      Taro.getSetting()
        .then((resp) => {
          if (!resp.authSetting['scope.writePhotosAlbum']) {
            Taro.authorize({
              scope: 'scope.writePhotosAlbum',
            })
              .then((res) => {
                if (res.errMsg == 'authorize:ok') {
                  resolve(true);
                } else {
                  resolve(false);
                }
              })
              .catch((err) => {
                resolve(false);
              });
          } else {
            resolve(true);
          }
        })
        .catch((err) => {
          resolve(false);
        });
    });
  };

  const getAlbum = (path) => {
    return new Promise((resolve, reject) => {
      Taro.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject();
        },
      });
    });
  };

  const openAuthSetting = () => {
    // 需要放置按钮才行
    return new Promise((resolve, reject) => {
      Taro.showModal({
        title: '授权提示',
        content: '打开保存图片权限',
        success(response) {
          if (response.confirm) {
            Taro.openSetting({
              success(res) {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  resolve();
                } else {
                  reject();
                  Taro.showToast({
                    title: '授权失败',
                    icon: 'none',
                  });
                }
              },
              fail() {
                reject();
                Taro.showToast({
                  title: '授权失败',
                  icon: 'none',
                });
              },
            });
          } else if (response.cancel) {
            reject();
            Taro.showToast({
              title: '授权失败',
              icon: 'none',
            });
          }
        },
      });
    });
  };

  const saveToAlbum = async (e) => {
    e.stopPropagation()
    const authResult = await getSetting();
    if (!authResult) {
      // await openAuthSetting()
      Taro.showToast({
        title: '未授权，无法保存图片',
        icon: 'none',
      });
      return;
    }

    Taro.showLoading({ title: '保存中...' });
    try {
      const album = await getAlbum(posterImage);

      if (album.errMsg == 'saveImageToPhotosAlbum:ok') {
        Taro.showToast({
          title: '保存到相册成功',
          icon: 'none',
        });
        Taro.hideLoading();
      }
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '保存失败',
        icon: 'none',
      });
    }
  };

  const handleCancel = () => {
    if (posterImage) {
      onCancel && onCancel();
    }
  };

  return (
    <>
      {isOpened && (
        <Canvas
          canvasId="shareCanvas"
          style={{
            width: canvasInfo.width,
            height: canvasInfo.height,
            position: 'fixed',
            top: 0,
            left: '1000px',
          }}
        ></Canvas>
      )}
      {posterImage && (
        <View
          className={style.mask}
          style={{ display: isOpened ? 'flex' : 'none' }}
          onClick={handleCancel}
        >
          <>
            <View className={style.wrap}>
              <Image
                className={style.img}
                src={posterImage}
                style={{
                  width: canvasInfo.width / 2,
                  height: canvasInfo.height / 2,
                  backgroundColor: '#fff',
                }}
              ></Image>
            </View>
            <View className={style.wrap}>
              <View className={`${style.btn} at-icon at-icon-download`} onClick={saveToAlbum}>
                {' '}
                保存
              </View>
            </View>
          </>
        </View>
      )}
    </>
  );
};

export default DrawCanvas;
