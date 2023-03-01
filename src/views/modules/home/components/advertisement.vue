<template>
  <div class="panel padding-15">
    <div class="panel-content">
      <div class="flex-box text-align-center">
        <div
          class="panel-content flex-item_f-1"
          id="contentEfficiency"
          style="width: 100%; height: 400%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script >
import { defineComponent, nextTick } from "vue";
import * as echarts from "echarts";
export default defineComponent({
  setup() {
    const init = async (option) => {
      nextTick(async () => {
        let mCharts = echarts.init(
          document.getElementById("contentEfficiency")
        );
        mCharts.clear();
        mCharts.setOption(option);
      });
    };
    return {
      init,
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
