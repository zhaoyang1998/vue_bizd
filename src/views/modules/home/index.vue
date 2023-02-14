<template>
  <ContainerCustom>
    <template #default>
      <div class="panel margin-20 width-150">
        <el-form-item>
          <el-select clearable placeholder="请选择客户">
            <el-option label="调研" value="0" />
            <el-option label="正式实施" value="1" />
            <el-option label="POC" value="2" />
          </el-select>
        </el-form-item>
      </div>
      <div class="home-container flex-box flex_w-wrap margin-10">
        <Introduction :option="totalOption" class="flex-item_f-3 margin-10" />
        <Interacted :option="dayOption" class="flex-item_f-3 margin-10" />
        <div class="width-full flex-box">
          <Advertisement
            :option="efficiencyOption"
            class="margin-10 flex-item_f-1"
            style="magrin: auto"
          />
        </div>
      </div>
    </template>
  </ContainerCustom>
</template>

<script >
import { defineComponent, reactive } from "vue";

import ContainerCustom from "@/components/container-custom/index.vue";
import Introduction from "./components/introduction.vue";
import Interacted from "./components/interacted.vue";
import Advertisement from "./components/advertisement.vue";

export default defineComponent({
  components: { ContainerCustom, Introduction, Interacted, Advertisement },
  setup() {
    const efficiencyOption = reactive({
      legend: {
        data: ["招商银行", "浦发银行", "广发银行", "上海银行"],
      },
      xAxis: {
        type: "category", // 还有其他的type，可以去官网喵两眼哦
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // x轴数据
        name: "日期", // x轴名称
        // x轴名称样式
        nameTextStyle: {
          fontWeight: 600,
          fontSize: 18,
        },
      },
      yAxis: {
        type: "value",
        name: "平均实施时间/min", // y轴名称
        // y轴名称样式
        nameTextStyle: {
          fontWeight: 600,
          fontSize: 18,
        },
      },
      label: {},
      tooltip: {
        trigger: "axis", // axis   item   none三个值
      },
      series: [
        {
          name: "招商银行",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
        },
        {
          name: "浦发银行",
          data: [620, 711, 823, 934, 1445, 1456, 1178],
          type: "line",
        },
        {
          name: "广发银行",
          data: [612, 920, 1140, 1160, 1190, 1234, 1321],
          type: "line",
        },
        {
          name: "上海银行",
          data: [234, 320, 453, 567, 789, 999, 1200],
          type: "line",
        },
      ],
    });
    const totalOption = reactive({
      series: [
        {
          type: "pie",
          data: [
            { value: 11231, name: "淘宝" },
            { value: 22673, name: "京东" },
            { value: 6123, name: "唯品会" },
            { value: 8989, name: "1号店" },
            { value: 6700, name: "聚美优品" },
          ],
          label: {
            show: true,
            formatter: function (arg) {
              return (
                arg.data.name +
                "\n" +
                arg.data.value +
                "个\n" +
                arg.percent +
                "%"
              );
            },
          },
        },
      ],
    });
    const dayOption = reactive({
      series: [
        {
          type: "pie",
          data: [
            { value: 11231, name: "淘宝" },
            { value: 22673, name: "京东" },
            { value: 6123, name: "唯品会" },
            { value: 8989, name: "1号店" },
            { value: 6700, name: "聚美优品" },
          ],
          label: {
            show: true,
            formatter: function (arg) {
              return (
                arg.data.name +
                "\n" +
                arg.data.value +
                "个\n" +
                arg.percent +
                "%"
              );
            },
          },
        },
      ],
    });

    return {
      efficiencyOption,
      totalOption,
      dayOption,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel {
  height: fit-content;
  border-radius: var(--el-border-radius-base);
  background-color: var(--gl-content-panel-background-color);
  &-title {
    font-weight: 700;
  }
  &-content {
    .el-image + .el-image {
      margin-left: 10px;
    }
    p {
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
