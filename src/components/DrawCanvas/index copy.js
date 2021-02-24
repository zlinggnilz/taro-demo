import React from 'react';
import Taro, { Component } from '@tarojs/taro';
import { View, Canvas, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import base64src from '../base64src';
// import shareImg from '../logo.png';
import './index.scss';

let baseUrlCode = '';
export default class TestCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 560,
      canvasHeight: 978,
      bgImgPath: '',
      posterImage: '',
    };
  }

  componentWillMount() {
    // base64 需要转换
    let str3 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkAQMAAAAjexcCAAAABlBMVEX///8AAABVwtN+AAABc0lEQVRIidWWQZbDMAhDuYHuf0tuwCCBpzNrtGlem8Q/fXUsBDji246qygxkX/vES1pofzNRxZsGKeKgPVmjHifn4dBHuQ5ELyOtFLqr7Cc+qgd9QmvE1YSHKpqf42+MT3TMBiiY+G/BCy15oyIQZMC8w5miNKD0lAn8gYMWBZolTLbAQzuEoO5aQ/tvHHOnfHFQE3DiNYqBUp1cx9GG9avZkRKVRGmK9cmdMvXaGwxnKSnLREOGZq1rIz517pQzMbUVRjx1DJQvPu77zGWgbRAK3zOx4ve1PJTeoCqr1N7dKSdIjYN9LyYLDVSeo/tQW+otlDlYcl9iksZDlXrjviBfze60mHoqmqr5W/vONNT9hViP1tMGypakkKraz08MlAWe1p79z2umd/ocqDi+ZDFQ/n+bj9qzra797lS7Faj7yymzCgPVrk3tTuqM6h6q6smFaGvspFRJ2b39yUD5QJ+3zfRQRrO0H1YVjc8e8Ua/6/gBOpv1YBO8iNcAAAAASUVORK5CYII=';
    base64src(str3, (res) => {
      baseUrlCode = res;
    });
    // Taro.getSystemInfo().then((res) => {
      // this.setState({
        // canvasWidth:res.windowWidth*2,
        // canvasHeight:res.windowHeight*2
      // });
    // });
  }

  // 获取微信相册授权信息
  getSetting() {
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
                  reject(false);
                }
              })
              .catch(() => {
                reject(false);
              });
          } else {
            resolve(true);
          }
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  // 下载网络图片
  downLoad = () => {
    const { img } = this.props;
    let that = this;
    Taro.downloadFile({
      url: img,
      success: function (res) {
        that.state.bgImgPath = res.tempFilePath;
        that.openShareImg();
      },
    });
  };

  // 绘制图片
  wxDrawImage(callback) {
    const { canvasHeight } = this.state;
    Taro.showLoading({ title: '图片生成中', mask: true });
    const WIDTH = 560;
    var ctx = Taro.createCanvasContext('shareCanvas', this.$scope);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, WIDTH, canvasHeight);
    ctx.clearRect(0, 0, 0, 0);

    Taro.getImageInfo({ src: this.state.bgImgPath }).then((res) => {
      // 获取图片的高度
      const HEIGHT = res.height;
      const IMAHEWIDTH = res.width;

      // ctx.drawImage(shareImg, (WIDTH - 180) / 2, -20, 180, 120);
      // ctx.restore();

      ctx.setFillStyle('#333333'); //  颜色
      ctx.setFontSize(26);
      let str1 = '限时特卖|03月2610:00-03月28日09:59';
      let left1 = (WIDTH - ctx.measureText(str1).width) / 2;
      ctx.fillText(str1, left1, 88 + 26); //字体加设计高度

      ctx.fillStyle = '#D8D8D8';
      ctx.fillRect(0, 152, WIDTH, 560);
      ctx.clearRect(0, 0, 0, 0);

      ctx.drawImage(
        this.state.bgImgPath,
        (WIDTH - IMAHEWIDTH) / 2,
        152 + (560 - HEIGHT) / 2,
        IMAHEWIDTH,
        HEIGHT
      );
      ctx.restore();

      let str2 = '限时特卖限时特限时特卖限时特卖限时特卖';
      let [contentLeng, contentArray, contentRows] = this.textByteLength(str2, 20);
      let hs = contentRows * 38;
      for (let m = 0; m < contentArray.length; m++) {
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('left');
        ctx.font = 'normal bold 28px sans-serif';
        ctx.fillText(contentArray[m], 32, 786 + 38 * m);
      }

      // 图片转码
      ctx.drawImage(baseUrlCode, WIDTH - 140 - 32, 754, 140, 140);
      ctx.restore();

      ctx.setFillStyle('#333333'); //  颜色
      ctx.setFontSize(32);
      let str4 = '￥2999.00';
      let left4 = ctx.measureText(str4).width;
      ctx.font = 'normal bold 32px sans-serif';
      ctx.fillText(str4, 32, 798 + hs);

      let str5 = '文本文本';
      let width5 = ctx.measureText(str5).width;
      ctx.fillStyle = '#FFDDDD';
      ctx.fillRect(left4 + 32 + 16, 766 + hs, width5 + 20, 38);


      ctx.draw(true, () => {
        callback && callback();
      });
    });
  }

  // 授权提示
  showModal() {
    let that = this;
    Taro.showModal({
      title: '授权提示',
      content: '打开保存图片权限',
      success(response) {
        if (response.confirm) {
          Taro.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                // 调用画图
                that.wxDrawImage(() => {
                  that.saveImage();
                });
              } else {
                Taro.showToast({
                  title: '授权失败',
                  icon: 'none',
                });
              }
            },
            fail() {
              Taro.showToast({
                title: '授权失败',
                icon: 'none',
              });
            },
          });
        } else if (response.cancel) {
          Taro.showToast({
            title: '授权失败',
            icon: 'none',
          });
        }
      },
    });
  }

  // 打开分享
  openShareImg() {
    this.getSetting()
      .then((res) => {
        if (!res) {
          this.showModal();
        } else {
          this.wxDrawImage(() => {
            this.saveImage();
          });
        }
      })
      .catch(() => {
        this.showModal();
      });
  }

  openImage() {}

  // 图片保存
  saveImage() {
    let that = this;
    const { canvasWidth, canvasHeight } = this.state;
    Taro.canvasToTempFilePath(
      {
        width: canvasWidth,
        height: canvasHeight,
        destWidth: canvasWidth * 2,
        destHeight: canvasHeight * 2,
        x: 0,
        y: 0,
        canvasId: 'shareCanvas',
        success: function (res) {
          Taro.hideLoading();
          that.setState({
            posterImage: res.tempFilePath,
          });
        },
      },
      that.$scope
    );
  }

  /**
   * 生成海报获取文字
   * @param string text 为传入的文本
   * @param int num 为单行显示的字节长度
   * @return array
   */
  textByteLength(text, num) {
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
  }

  render() {
    const { canvasWidth, canvasHeight, posterImage } = this.state;
    const style = {
      position: 'fixed',
      top: 0,
      left: '1000px',
    };
    return (
      <View className="canvas">
        <Canvas
          canvasId="shareCanvas"
          style={{ width: canvasWidth + 'px', height: canvasHeight + 'px', ...style }}
        ></Canvas>
        <AtButton type="primary" circle onClick={this.downLoad}>
          {' '}
          保存图片
        </AtButton>
        {posterImage ? (
          <Image
            className="img"
            src={posterImage}
            style={{
              width: canvasWidth / 2 + 'px',
              height: canvasHeight / 2 + 'px',
              backgroundColor: '#fff',
            }}
          ></Image>
        ) : (
          ''
        )}
      </View>
    );
  }
}
