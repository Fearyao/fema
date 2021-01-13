<!--
 * @Description: 
 * @Author: WYY
 * @Date: 2021-01-09 11:02:25
 * @LastEditTime: 2021-01-13 10:54:57
 * @LastEditors: WYY
-->
<template>
  <div>
    {{ treeData }}
    <hr />
    <div
      ref="DC"
      :class="{ 'drag-container': true, canDrag: spaceKeydown }"
      @mousedown.stop="mousedown($event)"
      @mouseup.stop="mouseup($event)"
      @
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
    return {
      spaceKeydown: false,
      scaleNum: 1
    };
  },
  methods: {
    ...mapActions("tree", ["setState"]),
    initData() {
      this.treeData.forEach(item => {
        item.hideChild = false;
      });
    },
    mousedown(event) {
      if (this.spaceKeydown == false) {
        return;
      }
      event = event || window.event;
      var _target = this.$refs.DC;
      var startx = event.clientX;
      var starty = event.clientY;
      var sb_bkx = startx - _target.offsetLeft;
      var sb_bky = starty - _target.offsetTop;
      //TODO  应该是容器的右下角
      var ww = document.documentElement.clientWidth;
      var wh = window.innerHeight;
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
      document.onmousemove = ev => {
        var event = ev || window.event;
        if (
          event.clientY < 0 ||
          event.clientX < 0 ||
          event.clientY > wh ||
          event.clientX > ww
        ) {
          return false;
        }
        var endx = event.clientX - sb_bkx;
        var endy = event.clientY - sb_bky;

        console.log("%c⧭", "color: #00b300", endx, endy);
        _target.style.left = endx + "px";
        _target.style.top = endy + "px";
      };
    },
    mouseup() {
      document.onmousemove = null;
    }
  },
  mounted() {
    document.onkeydown = event => {
      if (event.code == "Space") {
        this.spaceKeydown = true;
      }
    };
    document.onkeyup = event => {
      if (event.code == "Space") {
        this.spaceKeydown = false;
      }
    };
    this.$refs.DC.onmousewheel = event => {
      //event.wheelDelat 可以获取滚轮滚动方向 上滚为正值
      //alert("1")
      if (event.wheelDelta > 0) {
        if (this.scaleNum.toFixed(1) > 0.1) {
          this.scaleNum = this.scaleNum + 0.1;
        }
        if (this.scaleNum > 5) {
          this.scaleNum = 5;
        }
        this.$refs.DC.style.transform = "scale(" + this.scaleNum + ")";
      } else {
        this.scaleNum = this.scaleNum - 0.1;
        if (this.scaleNum < 0.2) {
          this.scaleNum = 0.2;
        }
        this.$refs.DC.style.transform = "scale(" + this.scaleNum + ")";
      }

      //取消浏览器默认滚动条，不然会跟着事件以前滚动
      return false;
    };
  },
  destroyed() {
    document.onkeydown = null;
    document.onkeyup = null;
  }
};
</script>

<style scoped lang="scss">
.drag-container {
  position: absolute;
  user-select: none;
}
.canDrag {
  cursor: url("../../assets/logo.png"), pointer;
}
</style>
