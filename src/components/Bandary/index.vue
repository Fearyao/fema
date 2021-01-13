<!--
 * @Description: 边界图组件
 * @Author: WYY
 * @Date: 2021-01-13 13:49:01
 * @LastEditTime: 2021-01-13 17:36:31
 * @LastEditors: WYY
-->
<template>
  <div class="bandary">
    <div id="mountNode"></div>
  </div>
</template>
<script>
import G6 from "@antv/g6";

export default {
  methods: {
    renderG6() {
      // The symbols for the marker inside the combo
      const collapseIcon = (x, y, r) => {
        return [
          ["M", x - r, y],
          ["a", r, r, 0, 1, 0, r * 2, 0],
          ["a", r, r, 0, 1, 0, -r * 2, 0],
          ["M", x - r + 4, y],
          ["L", x - r + 2 * r - 4, y]
        ];
      };
      const expandIcon = (x, y, r) => {
        return [
          ["M", x - r, y],
          ["a", r, r, 0, 1, 0, r * 2, 0],
          ["a", r, r, 0, 1, 0, -r * 2, 0],
          ["M", x - r + 4, y],
          ["L", x - r + 2 * r - 4, y],
          ["M", x - r + r, y - r + 4],
          ["L", x, y + r - 4]
        ];
      };

      G6.registerCombo(
        "cRect",
        {
          drawShape: function drawShape(cfg, group) {
            const self = this;
            // Get the padding from the configuration
            cfg.padding = cfg.padding || [50, 20, 20, 20];
            // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
            const style = self.getShapeStyle(cfg);
            // Add a rect shape as the keyShape which is the same as the extended rect Combo
            const rect = group.addShape("rect", {
              attrs: {
                ...style,
                x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
                y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
                width: style.width,
                height: style.height
              },
              draggable: true,
              name: "combo-keyShape"
            });
            // Add the circle on the right
            group.addShape("marker", {
              attrs: {
                ...style,
                fill: "#fff",
                opacity: 1,
                // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
                x: cfg.style.width / 2 + cfg.padding[1],
                y: (cfg.padding[2] - cfg.padding[0]) / 2,
                r: 10,
                symbol: collapseIcon
              },
              draggable: true,
              name: "combo-marker-shape"
            });
            return rect;
          },
          // Define the updating logic of the right circle
          afterUpdate: function afterUpdate(cfg, combo) {
            const group = combo.get("group");
            // Find the circle shape in the graphics group of the Combo by name
            const marker = group.find(
              ele => ele.get("name") === "combo-marker-shape"
            );
            // Update the position of the right circle
            marker.attr({
              // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
              x: cfg.style.width / 2 + cfg.padding[1],
              y: (cfg.padding[2] - cfg.padding[0]) / 2,
              // The property 'collapsed' in the combo data represents the collapsing state of the Combo
              // Update the symbol according to 'collapsed'
              symbol: cfg.collapsed ? expandIcon : collapseIcon
            });
          }
        },
        "rect"
      );

      G6.registerBehavior("click-add-edge", {
        // Set the events and the corresponding responsing function for this behavior
        getEvents() {
          return {
            "node:click": "onClick",
            "combo:click": "onClick", // The event is canvas:click, the responsing function is onClick
            mousemove: "onMousemove" // The event is mousemove, the responsing function is onMousemove
            // "edge:click": "onEdgeClick" // The event is edge:click, the responsing function is onEdgeClick
          };
        },
        // The responsing function for node:click defined in getEvents
        onClick(ev) {
          console.log("%c⧭", "color: #807160", ev);
          const self = this;
          const node = ev.item;
          const graph = self.graph;
          // The position where the mouse clicks
          // const point = { x: ev.x, y: ev.y };
          const model = node.getModel();
          if (self.addingEdge && self.edge) {
            graph.updateItem(self.edge, {
              target: model.id
            });

            self.edge = null;
            self.addingEdge = false;
          } else {
            // Add anew edge, the end node is the current node user clicks
            self.edge = graph.addItem("edge", {
              source: model.id,
              target: model.id
            });
            self.addingEdge = true;
          }
        },
        // The responsing function for mousemove defined in getEvents
        onMousemove(ev) {
          const self = this;
          // The current position the mouse clicks
          const point = { x: ev.x, y: ev.y };
          if (self.addingEdge && self.edge) {
            // Update the end node to the current node the mouse clicks
            self.graph.updateItem(self.edge, {
              target: point
            });
          }
        },
        // The responsing function for edge:click defined in getEvents
        onEdgeClick(ev) {
          console.log("%c⧭", "color: #007300", ev);
          const self = this;
          const currentEdge = ev.item;
          // self.graph.removeItem(currentEdge);
          // TODO 可能是层级问题 电价添加线的时候 第二次终点的点击可能是点击在了连线上 而不是终点的combo上 需要特殊处理
          if (self.addingEdge && self.edge === currentEdge) {
            self.graph.removeItem(self.edge);
            self.edge = null;
            self.addingEdge = false;
          }
        }
      });

      const data = {
        nodes: [
          // { id: "node1", x: 250, y: 200, comboId: "combo1" }
          // { id: "node2", x: 300, y: 200, comboId: "combo1" },
          // { id: "node3", x: 100, y: 200, comboId: "combo3" }
        ],
        combos: [
          // { id: "combo1", label: "Combo 1", parentId: "combo2" },
          { id: "combo2", label: "Combo 2" },
          { id: "combo3", label: "Combo 3", collapsed: true },
          { id: "combo4", label: "Combo 4", collapsed: true }
        ]
      };

      const container = document.getElementById("mountNode");

      const width = container.scrollWidth;
      const height = (container.scrollHeight || 500) - 20;
      const graph = new G6.Graph({
        container: "mountNode",
        width,
        height,
        // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
        groupByTypes: false,
        // Configure the combos globally
        defaultCombo: {
          // The type of the combos. You can also assign type in the data of combos
          type: "cRect"
          // ... Other global configurations for combos
        },
        modes: {
          default: [
            {
              type: "drag-combo",
              onlyChangeComboSize: true
            },
            {
              type: "drag-node",
              onlyChangeComboSize: true
            },
            "drag-canvas",
            "click-add-edge"
          ]
        }
      });
      graph.data(data);
      graph.render();

      // collapse/expand when click the marker
      graph.on("combo:click", e => {
        if (e.target.get("name") === "combo-marker-shape") {
          // graph.collapseExpandCombo(e.item.getModel().id);
          graph.collapseExpandCombo(e.item);
          if (graph.get("layout")) graph.layout();
          else graph.refreshPositions();
        }
      });

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight - 20);
        };
    }
  },
  mounted() {
    this.renderG6();
  }
};
</script>

<style lang="scss" scoped>
.mountNode {
  width: 100%;
  height: 100%;
}
</style>
