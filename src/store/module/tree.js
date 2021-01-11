/*
 * @Description:
 * @Author: WYY
 * @Date: 2021-01-11 15:54:17
 * @LastEditTime: 2021-01-11 16:46:09
 * @LastEditors: WYY
 */
import { jsPlumb } from "jsplumb";
import Vue from "vue";
const state = {
  focusedNode: null, //选中的节点
  refresh: true,
  isEdit: false // 编辑状态
};

const mutations = {
  SET_STATE(state, payload) {
    Object.assign(state, payload);
  }
};

const actions = {
  setState({ commit }, payload) {
    commit("SET_STATE", payload);
  },

  /**
   * @description: 重新渲染
   * @param {*} commit
   * @return {*}
   */
  reset({ commit }) {
    jsPlumb.reset();
    commit("SET_STATE", { refresh: false });
    Vue.nextTick(() => {
      commit("SET_STATE", { refresh: true });
    });
  },

  /**
   * @description: 连接两个点
   * @param {*} source 起点dom id
   * @param {*} target 终点dom id
   * @param {*} commom 连线配置
   * @return {*}
   */
  connect(
    source,
    target,
    common = {
      endpoint: "Blank",
      connector: ["Flowchart"],
      anchors: ["Right", "Left"],
      paintStyle: { stroke: "#3ef", strokeWidth: 0.5 },
      overlays: [["Arrow", { width: 5, length: 5, location: 1 }]]
    }
  ) {
    jsPlumb.connect({
      source,
      target,
      ...common
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
