import Taro from '@tarojs/taro';
import { formatTime } from './utils';

const baseUrl = 'https://www.fastmock.site/mock/0b4074af2b2246db595b590dc41d824f/sunny';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '暂无操作权限!',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  408: '请求超时。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// res:
// {
//   cookies: Array<{
//     name: string,
//     value: string,
//     expires: string,
//     path: string
//   }>,
//   header: {
//     'Set-Cookie': string
//   }
// }

// const setCookie = (res) => {
//   if (res.cookies && res.cookies.length > 0) {
//     let cookies = "";
//     res.cookies.forEach((cookie, index) => {
//       // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
//       if (cookie.name && cookie.value) {
//         cookies +=
//           index === res.cookies.length - 1
//             ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}`
//             : `${cookie.name}=${cookie.value};`;
//       } else {
//         cookies += `${cookie};`;
//       }
//     });
//     Taro.setStorageSync("cookies", cookies);
//   }
//   if (res.header && res.header["Set-Cookie"]) {
//     Taro.setStorageSync("cookies", res.header["Set-Cookie"]);
//   }
// };

const logError = (name, msg, info) => {
  if (!info) {
    info = 'Error';
  }
  let time = formatTime(new Date());
  console.error(time, name, msg, info);
  if (typeof info === 'object') {
    info = JSON.stringify(info);
  }
};

const customInterceptor = (chain) => {
  const requestParams = chain.requestParams;

  return chain
    .proceed(requestParams)
    .then((res) => {
      // 只要请求成功，不管返回什么状态码，都走这个回调
      // console.log('res', res);
      // setCookie(res);
      const { statusCode, data: resData } = res;
      const { code, desc, data: result } = resData || {};

      if (statusCode === 200) {
        if (code == 0) {
          return { data: result ,code};
        }

        return Promise.reject({ code, msg: desc });
      }

      const msg = codeMessage[statusCode] || desc;

      return Promise.reject({ code: statusCode, msg: msg });
    })
    .catch((err) => {
      const { statusCode, code, msg } = err;

      const errMsg = codeMessage[statusCode];

      Taro.showToast({
        title: errMsg || msg || '请求失败',
        icon: 'none',
        duration: 2000,
      });

      return Promise.reject({ code: statusCode || code, msg: msg });
    });
};

Taro.addInterceptor(customInterceptor);
Taro.addInterceptor(Taro.interceptors.logInterceptor);

class HttpRequest {
  baseOptions(params, method = 'GET') {
    let { url, data } = params;
    let contentType = 'application/json';
    contentType = params.contentType || contentType;

    const option = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        // cookie: Taro.getStorageSync("cookies"),
      },
      // mode: 'cors',
      xhrFields: { withCredentials: true },
    };
    // eslint-disable-next-line
    return Taro.request(option);
  }
  get(url, data) {
    let option = { url, data };
    return this.baseOptions(option);
  }
  post(url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, 'POST');
  }
  put(url, data) {
    let option = { url, data };
    return this.baseOptions(option, 'PUT');
  }
  delete(url, data) {
    let option = { url, data };
    return this.baseOptions(option, 'DELETE');
  }
}

export default new HttpRequest();
