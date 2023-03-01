<template>
  <el-drawer
    title="实施详情"
    v-model="drawer"
    :append-to-body="true"
    :show-close="true"
    :size="width"
    :before-close="handleClose"
  >
    <el-steps :active="step.seq" finish-status="success" :align-center="true">
      <el-step v-for="i in step.total" :title="'步骤' + i" :key="i"></el-step>
    </el-steps>
    <el-form ref="form" :model="step" label-width="80px">
      <el-row :gutter="20" class="rowTop">
        <el-col :span="6"><span>步骤名称:</span></el-col>
      </el-row>
      <el-row :gutter="20" class="rowTop">
        <el-col :span="16" :offset="2">
          <el-input
            placeholder="请输入内容"
            v-model="step.stepName"
            clearable
            style="width: 400px"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="rowTop">
        <el-col :span="6"><span>时间段:</span></el-col>
      </el-row>
      <el-row :gutter="20" class="rowTop">
        <el-col :span="16" :offset="2">
          <div class="block">
            <el-date-picker
              value-format="YYYY-MM-DD HH:mm:ss"
              v-model="times"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="rowTop">
        <el-col :span="6"><span>具体内容:</span></el-col>
      </el-row>
      <el-row :gutter="20" class="rowTop">
        <el-col :span="16" :offset="2">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="step.desc"
            :autosize="{ minRows: 3, maxRows: 6 }"
            style="width: 400px"
          >
          </el-input>
        </el-col>
      </el-row>
    </el-form>
    <div class="bottom">
      <el-button @click="prev" type="primary">上一步</el-button>
      <el-button @click="delStep" type="danger">删除</el-button>
      <el-button @click="next" type="primary">下一步</el-button>
      <el-button @click="save" type="success">保存</el-button>
    </div>
  </el-drawer>
</template>
  
  <script>
import { defineComponent, reactive, toRefs } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  getPPDetail,
  getNextPPDetail,
  delPPDetail,
  getPrevPPDetail,
  updatePPDetail,
} from "@/api/implementDetails";
export default defineComponent({
  setup(props, { emit }) {
    const data = reactive({
      drawer: false,
      width: "25%",
      times: [],
      step: {
        implementDetailId: "",
        pointPositionId: "",
        desc: "",
        stepName: "",
        total: 1,
        seq: 1,
        startTime: "",
        endTime: "",
      },
      pointPositionId: "",
    });

    const init = async (pointPositionId) => {
      data.step.pointPositionId = pointPositionId;
      await getCurDeatil();
      data.drawer = true;
    };
    const getCurDeatil = async () => {
      const r = await getPPDetail(data.step);
      timeTransfer(JSON.parse(r.data));
    };
    const next = async () => {
      data.step.startTime = data.times[0];
      data.step.endTime = data.times[1];
      const r = await getNextPPDetail(data.step);
      timeTransfer(JSON.parse(r.data));
    };
    const delStep = async () => {
      const r = await delPPDetail(data.step.implementDetailId);
      timeTransfer(JSON.parse(r.data));
    };
    const prev = async () => {
      if (data.step.seq > 1) {
        data.step.startTime = data.times[0];
        data.step.endTime = data.times[1];
        const r = await getPrevPPDetail(data.step);
        timeTransfer(JSON.parse(r.data));
      }
    };
    const save = async () => {
      data.step.startTime = data.times[0];
      data.step.endTime = data.times[1];
      await updatePPDetail(data.step);
      data.drawer = false;
    };
    const timeTransfer = (r) => {
      data.times[0] = r.startTime;
      data.times[1] = r.endTime;
      data.step = r;
    };
    const handleClose = async (done) => {
      ElMessageBox.confirm("是否确认关闭?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await save();
          ElMessage.success({
            message: "保存成功!",
          });
        })
        .catch(() => {
          ElMessage.info({
            message: "已取消",
          });
        });
    };
    return {
      handleClose,
      init,
      next,
      delStep,
      timeTransfer,
      prev,
      save,
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
  