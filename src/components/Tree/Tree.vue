<!--
 * @Description: 树状结构
 * @Author: WYY
 * @Date: 2021-01-11 09:59:06
 * @LastEditTime: 2021-01-11 17:44:24
 * @LastEditors: WYY
-->

<template>
  <div class="node-container">
    <div class="leaf" v-for="item in treeData" :key="item.id">
      <Node :node="item" />
      <Tree
        v-if="item.children && !item.hideChild"
        :tree-data="item.children"
      />
    </div>
  </div>
</template>

<script>
import Node from "./Node";
import { jsPlumb } from "jsplumb";
export default {
  name: "Tree",
  components: {
    Node
  },
  props: {
    treeData: {
      type: Array,
      default: () => ({})
    }
  },
  created() {},
  methods: {
    link(source, target) {
      const common = {
        endpoint: "Blank",
        connector: ["Flowchart"],
        anchors: ["Right", "Left"],
        paintStyle: { stroke: "#3ef", strokeWidth: 0.5 },
        overlays: [["Arrow", { width: 5, length: 5, location: 1 }]]
      };
      jsPlumb.connect({
        source,
        target,
        ...common
      });
    },
    linkChild() {
      this.treeData.forEach(item => {
        if (item.children) {
          item.children.forEach(subItem => {
            this.link(item.id, subItem.id);
          });
        }
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.linkChild();
    }, 10);
  }
};
</script>

<style lang="scss" scoped>
.node-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .leaf {
    flex: 0 0 auto;
    margin-left: 32px;
    display: flex;
    align-items: center;
    flex-direction: row;
  }
}
</style>
