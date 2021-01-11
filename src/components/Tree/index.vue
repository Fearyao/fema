<!--
 * @Description: 
 * @Author: WYY
 * @Date: 2021-01-09 11:02:25
 * @LastEditTime: 2021-01-11 17:50:18
 * @LastEditors: WYY
-->
<template>
  <div>
    {{ treeData }}
    <hr />
    <button @click="setState({ isEdit: !isEdit })">编辑</button>
    <div
      ref="DC"
      class="drag-container"
      draggable="true"
      @dragstart="dragStart"
      @dragend="dragEnd"
      @drag="drag"
    >
      <Tree v-if="refresh" :treeData="treeData" />
    </div>
  </div>
</template>

<script>
import Tree from "./Tree";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Tree
  },
  props: {
    treeData: {
      type: Array,
      default: () => ({})
    }
  },
  computed: {
    ...mapState("tree", ["refresh", "isEdit"])
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("tree", ["setState"]),
    initData() {
      this.treeData.forEach(item => {
        item.hideChild = false;
      });
    },
    initDrag() {},
    dragStart() {},
    drag(event) {
      const { target, offsetX } = event;
      console.log("%c⧭", "color: #ffa640", event);
      target.style.left = offsetX;
      this.$refs.DC.style.marginLeft = offsetX;
    },
    dragEnd() {}
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.drag-container {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
}
</style>
