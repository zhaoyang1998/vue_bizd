<template>
  <el-drawer :title=allTime v-model="drawer" :append-to-body="true" :show-close="true" :size="width"
    :before-close="handleClose">
    <div class="block" >
      <el-timeline >
        <el-timeline-item v-for="(detail, index) in details" :key="index" type="success" size="large">


          <!-- 正常显示内容 -->
          <div v-if="!isEdit">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>{{ detail.stepName }}</span>
                  <span style="position: absolute; left: 60%" v-if="detail.totalTime">总耗时：{{ detail.totalTime }}
                    min</span>
                </div>
              </template>

              <div style="position: relative" class="el-timeline-item__timestamp">
                <span>{{ detail.startTime }} - {{ detail.endTime }}</span>
              </div>
              <br>
              <span>{{ detail.desc }}</span>
            </el-card>
          </div>

          <!-- 编辑内容 -->
          <div v-if="isEdit">
            <div style="position: relative" class="el-timeline-item__timestamp">
              <span>{{ detail.startTime }} - {{ detail.endTime }}</span>
              <span style="position: absolute; left: 60%" v-if="detail.totalTime">总耗时：{{ detail.totalTime }} min</span>
              <el-button style="border: 0; position: absolute; right: 0%; top: -50%" @click="del(index)">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
            <h4>实施概览：</h4>
            <el-input v-model="detail.stepName" placeholder="请输入内容"></el-input>
            <h4>时间：</h4>
            <el-date-picker style="width: 100%" v-model="detail.startTime" value-format="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm" type="datetime" placeholder="选择日期时间" @change="changeTime()">
            </el-date-picker>
            <h4>具体详情：</h4>
            <el-input type="textarea" placeholder="请输入实施详情" v-model="detail.desc" :autosize="{ minRows: 3, maxRows: 6 }"
              show-word-limit></el-input>
          </div>
          <el-divider />


        </el-timeline-item>
      </el-timeline>
    </div>

    <template #footer>
      <el-button v-if="isEdit" @click="add" type="primary">增加</el-button>
      <el-button v-if="!isEdit" @click="edit" type="primary">编辑</el-button>
      <el-button v-if="isEdit" @click="edit" type="primary">退出</el-button>
      <el-button v-if="isEdit" @click="save" type="success">保存</el-button>
    </template>
  </el-drawer>
</template>
    
<script>
import { Close } from "@element-plus/icons-vue";
import { defineComponent, reactive, toRefs, ref,nextTick} from "vue";
import { getAllDetail, saveDetail } from "@/api/implementDetails";
import { sleep } from "@antfu/utils";
export default defineComponent({
  setup(props, { emit }) {
    const data = reactive({
      allTime:"",
      isEdit: false,
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
      console.log(data.details[data.details.length-1])
      data.allTime="实施详情 -- 总实施时间为: "+(new Date(data.details[data.details.length-1].startTime).getTime() -
              new Date(data.details[0].startTime).getTime()) /
            60000 +"min";
    };
    const add = async () => {
      data.details.push(JSON.parse(JSON.stringify(data.step)));
      roll();
    };
    const roll =() => {
        const drawer = document.querySelector('.el-drawer__body');
        if (drawer) {
          nextTick(() =>{
            drawer.scrollTop = drawer.scrollHeight;
          })
        } 
    };
    
    const edit = async () => {
      if (data.isEdit) {
        data.isEdit = false
      } else {
        data.isEdit = true
      }
      console.log(data.isEdit)
    };
    const del = async (i) => {
      data.details.splice(i, 1);
      changeTime();
    };
    const save = async () => {
      data.drawer = false;
      await saveDetail(data.details);
      
      data.details = [];
      data.isEdit=false;
    };
    const changeTime = async () => {

      for (var i = 0; i < data.details.length; i++) {
        if (i > 0) {
          console.log(data.details)
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
      roll,
      add,
      save,
      edit,
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
    