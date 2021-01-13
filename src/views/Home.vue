<!--
 * @Description: 
 * @Author: WYY
 * @Date: 2021-01-09 11:02:25
 * @LastEditTime: 2021-01-13 13:52:21
 * @LastEditors: WYY
-->
<template>
  <div class="home">
    <div class="tree-container">
      <Tree :treeData="treeData" />
    </div>
    <div class="bandary-container">
      <Bandary />
    </div>
  </div>
</template>

<script>
import Tree from "@/components/Tree";
import Bandary from "@/components/Bandary";
export default {
  components: {
    Tree,
    Bandary
  },
  props: {},
  computed: {},
  data() {
    return {
      treeData: [
        {
          id: "id-1",
          label: "1",
          children: [
            {
              id: "id-1-1",
              label: "1-1"
            },
            {
              id: "id-1-2",
              label: "1-2",
              hideChild: true,
              children: [
                {
                  id: "id-1-2-1",
                  label: "1-2-1"
                },
                {
                  id: "id-1-2-2",
                  label: "1-2-2"
                }
              ]
            },
            {
              id: "id-1-3",
              label: "1-3"
            },
            {
              id: "id-1-4",
              label: "1-4"
            }
          ]
        }
      ]
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  justify-content: flex-start;
  .bandary-container,
  .tree-container {
    width: 500px;
    height: 500px;
    border: 1px solid #cccccc;
    position: relative;
    overflow: hidden;
  }
}
</style>
