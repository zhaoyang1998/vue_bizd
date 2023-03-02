<template>
  <el-drawer
    title="实施详情"
    v-model="drawer"
    :append-to-body="true"
    :show-close="true"
    :size="width"
    :before-close="handleClose"
  >
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(detail, index) in details"
          :key="index"
          type="success"
          size="large"
          hide-timestamp="true"
        >
          <div style="position: relative" class="el-timeline-item__timestamp">
            <span>{{ detail.startTime }} - {{ detail.endTime }}</span>
            <span style="position: absolute; left: 60%" v-if="detail.totalTime"
              >总耗时：{{ detail.totalTime }} min</span
            >
            <el-button
              style="border: 0; position: absolute; right: 0%; top: -50%"
              @click="del(index)"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <h4>实施概览：</h4>
          <el-input
            v-model="detail.stepName"
            placeholder="请输入内容"
          ></el-input>
          <h4>时间：</h4>
          <el-date-picker
            style="width: 100%"
            v-model="detail.startTime"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            type="datetime"
            placeholder="选择日期时间"
            @change="changeTime()"
          >
          </el-date-picker>
          <h4>具体详情：</h4>
          <el-input
            type="textarea"
            placeholder="请输入实施详情"
            v-model="detail.desc"
            :autosize="{ minRows: 3, maxRows: 6 }"
            show-word-limit
          ></el-input>
        </el-timeline-item>
      </el-timeline>
    </div>
    <template #footer>
      <el-button @click="add" type="primary">增加</el-button>
      <!-- <el-button @click="next" type="primary">编辑</el-button> -->
      <el-button @click="save" type="success">保存</el-button>
    </template>
  </el-drawer>
</template>
    
<script>
import { Close } from "@element-plus/icons-vue";
import { defineComponent, reactive, toRefs } from "vue";
import { getAllDetail, saveDetail } from "@/api/implementDetails";
export default defineComponent({
  setup(props, { emit }) {
    const data = reactive({
      drawer: false,
      width: "30%",
      details: [],
      readonly: false,
      step: {
        implementDetailId: "",
        pointPositionId: "",
        desc: "",
        stepName: "",
        startTime: "",
        endTime: "",
      },
    });
    const init = async (pointPositionId, readonly) => {
      data.drawer = true;
      data.readonly = readonly;
      data.step.pointPositionId = pointPositionId;
      const r = await getAllDetail(pointPositionId);
      const tmp = JSON.parse(r.data);
      if (tmp.length !== 0) {
        console.log(tmp.length);
        data.details = tmp;
      } else {
        data.details.push(JSON.parse(JSON.stringify(data.step)));
      }
    };
    const add = async () => {
      data.details.push(JSON.parse(JSON.stringify(data.step)));
    };
    const del = async (i) => {
      data.details.splice(i, 1);
      changeTime;
    };
    const save = async () => {
      await saveDetail(data.details);
      data.drawer = false;
      data.details = [];
    };
    const changeTime = async () => {
      for (var i = 0; i < data.details.length; i++) {
        if (i > 0) {
          data.details[i - 1].endTime = data.details[i].startTime;
          data.details[i - 1].totalTime =
            (new Date(data.details[i - 1].endTime).getTime() -
              new Date(data.details[i - 1].startTime).getTime()) /
            60000;
        } else {
          data.details[i].totalTime =
            (new Date(data.details[i].endTime).getTime() -
              new Date(data.details[i].startTime).getTime()) /
            60000;
        }
      }
    };
    const handleClose = async () => {
      data.drawer = false;
      await save();
      data.details = [];
      data.step.pointPositionId = "";
    };

    return {
      init,
      handleClose,
      changeTime,
      add,
      save,
      del,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="scss" scoped>
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
    