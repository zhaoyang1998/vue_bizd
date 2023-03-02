<template>
  <el-drawer
    title="实施详情"
    v-model="drawer"
    :append-to-body="true"
    :show-close="true"
    size="50%"
    :before-close="handleClose"
  >
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="执行名称">
          <template v-slot="scope">
            <el-input v-model="scope.row.total" placeholder="请输入名称">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template v-slot="scope">
            <el-input
              v-model="scope.row.msg"
              type="textarea"
              autosize
              style="line-height: 40px !important"
              placeholder="请输入发送内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="执行名称">
          <template v-slot="scope">
            <el-input v-model="scope.row.name" placeholder="请输入名称">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" @click="delClick(scope.row)" size="small"
              >前插</el-button
            >
            <el-button type="text" @click="delClick(scope.row)" size="small"
              >后插</el-button
            >
            <el-button type="text" @click="delClick(scope.row)" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="add">添加</el-button>
      <el-button @click="edit">编辑</el-button>
      <el-button @click="save">保存</el-button>
    </div>
  </el-drawer>
</template>
  
<script>
import { defineComponent, reactive, toRefs, ref } from "vue";
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
    const tableData = ref([
      {
        implementDetailId: "",
        pointPositionId: "",
        desc: "",
        stepName: "",
        total: 1,
        seq: 1,
        startTime: "",
        endTime: "",
      },
    ]);
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
    const add = async () => {
      tableData.value.push({
        implementDetailId: "",
        pointPositionId: "",
        desc: "",
        stepName: "",
        total: 1,
        seq: 1,
        startTime: "",
        endTime: "",
      });
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
      add,
      ...toRefs(data),
      tableData,
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
  