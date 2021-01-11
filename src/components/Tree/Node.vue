<!--
 * @Description: 节点
 * @Author: WYY
 * @Date: 2021-01-11 09:59:13
 * @LastEditTime: 2021-01-11 17:45:23
 * @LastEditors: WYY
-->
<template>
  <div class="node">
    <div
      class="detail"
      :id="node.id"
      :class="{ focused: focusedNode == node.id }"
    >
      <input type="text" v-model="node.label" v-if="isEdit" />
      <span class="label" v-else @click="setState({ focusedNode: node.id })">
        {{ node.label }}
      </span>
      <span
        v-if="node.children"
        class="toggle-child"
        @click="toggleChild(node)"
      >
        {{ node.hideChild ? "+" : "-" }}
      </span>
    </div>
    <div class="infos">
      <div>功能/失效</div>
      <div>要求/规范</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    node: {
      type: Object,
      defalt: () => ({})
    }
  },
  computed: {
    ...mapState("tree", ["isEdit", "focusedNode"])
  },
  methods: {
    ...mapActions("tree", ["setState"]),
    toggleChild(target) {
      this.$set(target, "hideChild", !target.hideChild);
      this.$store.dispatch("tree/reset");
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.node {
  margin-bottom: 32px;
  width: 124px;
  flex: 0 0 auto;
  .detail {
    border-radius: 4px;
    border: 1px solid rgb(6, 190, 247);
    position: relative;
    input {
      border: 0;
      width: calc(100% - 2px);
    }
    .label {
      display: inline-block;
      width: 100%;
    }
  }
  .infos {
    text-align: left;
    color: aqua;
    font-size: 12px;
  }

  .toggle-child {
    position: absolute;
    right: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: calc(50% - 6px);
    line-height: 10px;
    font-size: 10px;
    text-align: center;
    cursor: pointer;
    color: white;
    background: rgb(0, 140, 255);
    z-index: 1;
  }

  .focused {
    border: 1px solid red;
  }
}
</style>
