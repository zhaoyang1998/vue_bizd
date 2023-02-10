<template>
  <div class="panel padding-15">
    <div class="panel-title margin_b-10 font-size-18">实施效率</div>
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
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import * as echarts from "echarts";
export default defineComponent({
  props: {
    option: {},
  },
  setup(props) {
    const showcontentEfficiency = () => {
      const mCharts = echarts.init(
        document.getElementById("contentEfficiency")
      );
      mCharts.setOption(props.option);
    };
    onMounted(async () => {
      await showcontentEfficiency();
    });
    return {
      showcontentEfficiency,
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
