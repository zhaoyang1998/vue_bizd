<template>
  <el-drawer
    title="实施详情"
    v-model="drawer"
    :append-to-body="true"
    :show-close="true"
    :size="width"
  >
    <div class="block">
      <el-timeline>
        <el-timeline-item
          placement="top"
          v-for="(detail, index) in details"
          :key="index"
          type="success"
          size="large"
          :timestamp="detail.startTime + '-' + detail.endTime"
        >
          <h4>实施概览：{{ detail.stepName }}</h4>
          <h4>总耗时：{{ detail.totalTime }}min</h4>
          <h4>具体详情：</h4>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="detail.desc"
            :autosize="{ minRows: 3, maxRows: 6 }"
            show-word-limit
            :readonly="true"
          ></el-input>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-drawer>
</template>
    
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { getAllDetail } from "@/api/implementDetails";
export default defineComponent({
  setup(props, { emit }) {
    const data = reactive({
      drawer: false,
      width: "25%",
      details: [],
    });
    const init = async (pointPositionId) => {
      data.drawer = true;
      const r = await getAllDetail(pointPositionId);
      data.details = JSON.parse(r.data);
    };

    return {
      init,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="scss">
.el-drawer__title {
  margin: 0;
  flex: 1;
  line-height: inherit;
  font-size: 1rem;
  text-align: center;
}
.rowTop {
  margin-top: 20px;
}
.bottom {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-31%, -80%);
  width: 100%;
}
</style>
    