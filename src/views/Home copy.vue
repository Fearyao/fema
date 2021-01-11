<!--
 * @Description: 
 * @Author: WYY
 * @Date: 2021-01-09 11:02:25
 * @LastEditTime: 2021-01-11 16:59:37
 * @LastEditors: WYY
-->
<template>
  <div>
    {{ treeData }}
    <hr />
    <button>编辑</button>
    <Tree v-if="refresh" :treeData="treeData" />
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import Tree from "@/components/Tree";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Tree
  },
  props: {},
  computed: {
    ...mapState("tree", ["refresh"])
  },
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
  methods: {
    ...mapActions("tree", ["setState"]),
    initData() {
      this.treeData.forEach(item => {
        item.hideChild = false;
        if (item.children) {
          // item.children.forEach(subItem => {
          //   // subItem.hideChild = false;
          // });
        }
      });
    },
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
    deepLink(treeData) {
      console.log("%c⧭", "color: #733d00", treeData);
      if (treeData.children && treeData.hideChild != true) {
        treeData.children.forEach(item => {
          this.link(treeData.id, item.id);
          this.deepLink(item);
        });
      }
    },
    linkAll() {
      this.treeData.forEach(item => {
        this.deepLink(item);
      });
    }
  },
  mounted() {
    console.log("%c⧭", "color: #0088cc", jsPlumb);
  }
};
</script>

<style scoped lang="scss">
.node-container {
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  justify-content: flex-start;
}

.node {
  margin-bottom: 32px;
  width: 128px;
}
.info {
  border: 1px solid rgb(6, 190, 247);
  position: relative;
}
.infos {
  color: aqua;
}
.toggle-child {
  position: absolute;
  right: -5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: calc(50% - 10px);
  border: 1px solid #ccc;
  line-height: 10px;
  font-size: 10px;
  text-align: center;
}
</style>
