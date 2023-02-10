<template>
  <div class="panel padding-15">
    <div class="panel-title margin_b-10 font-size-18">总实施数据</div>
    <div class="panel-content text-align-center">
      <div
        class="panel-content flex-item_f-1"
        id="contentTotal"
        style="width: 100%; height: 300%"
      ></div>
    </div>
  </div>
</template>

<script >
import { defineComponent, onMounted } from "vue";
import * as echarts from "echarts";
export default defineComponent({
  props: {
    option: {},
  },
  setup(props) {
    const showContentTotal = () => {
      const mCharts = echarts.init(document.getElementById("contentTotal"));
      mCharts.setOption(props.option);
    };
    onMounted(async () => {
      await showContentTotal();
    });
    return {
      showContentTotal,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel {
  height: fit-content;
  min-width: 400px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--gl-content-panel-background-color);
  &-title {
    font-weight: 700;
  }
  &-content {
    .text {
      text-indent: 2em;
    }
  }
}
</style>
