import { observable, action, flow, computed } from "mobx";
// import request from "../utils/request";

class Global {
  @observable systemInfo = {};
  @observable headerBtnPosi = {}; // bottom height left right top width
  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable statusBarHeight = 0;

  @computed
  get navHeight() {
    const { height = 0, top = 0 } = this.headerBtnPosi;
    return (top - this.statusBarHeight) * 2 + height + this.statusBarHeight;
  }
  @computed
  get navPadding() {
    const { right = 0 } = this.headerBtnPosi;
    return this.windowWidth - right;
  }

  @action.bound
  setSysInfo(info) {
    info = info || {};
    const { windowWidth = 0, windowHeight = 0, statusBarHeight = 0 } = info;
    this.systemInfo = info;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.statusBarHeight = statusBarHeight;
  }

  @action.bound
  setHeaderBtnPosi(info) {
    info = info || {};
    this.headerBtnPosi = info;
  }
}

export default new Global();
