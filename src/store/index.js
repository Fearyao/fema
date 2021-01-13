import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const requireModules = require.context("./module", false, /\.js$/);
const modules = {};
requireModules.keys().forEach(file => {
  if (file !== "./index.js") {
    const moduleName = file
      .split("/")
      .pop()
      .replace(/\.js$/g, "");
    const theModule = requireModules(file);
    const fileModule = theModule.default || theModule;
    modules[moduleName] = { ...fileModule };
  }
});

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules
});
