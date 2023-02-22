<template>
  <div class="panel padding-15">
    <div class="panel-content">
      <div class="flex-box text-align-center">
        <div
          class="panel-content flex-item_f-1"
          id="contentDay"
          style="width: 100%; height: 300%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script >
import { defineComponent } from "vue";
import * as echarts from "echarts";
export default defineComponent({
  setup() {
    const init = async (pointPosition) => {
      const mCharts = echarts.init(document.getElementById("contentDay"));
      mCharts.clear();
      mCharts.setOption(pointPosition);
    };
    return {
      init,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel {
  min-width: 400px;
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
