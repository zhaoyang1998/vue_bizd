<template>
  <el-dialog
    width="450px"
    :title="pointPosition.pointPositionId ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      v-loading="loading"
      :model="pointPosition"
      :rules="rules"
      label-width="auto"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="left"
      require-asterisk-position="right"
    >
      <el-form-item label="单位名称" prop="pointPositionName">
        <el-input
          v-model="pointPosition.pointPositionName"
          placeholder="单位名称"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="所属客户" prop="clientAbbreviation">
        <el-input
          v-model="pointPosition.clientAbbreviation"
          placeholder="所属客户"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="单位地址" prop="address">
        <el-input
          v-model="pointPosition.address"
          placeholder="单位地址"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input
          v-model="pointPosition.type"
          placeholder="类型"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="预计实施时间" prop="scheduledTime">
        <el-col :span="11">
          <el-date-picker
            type="datetime"
            time-arrow-control
            v-model="pointPosition.scheduledTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="实施人员" prop="implementerId">
        <el-select
          v-model="pointPosition.implementerId"
          clearable
          placeholder="请选择实施人员"
        >
          <el-option
            :key="item"
            :label="item.userName"
            :value="item.userId"
            v-for="item in users"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, nextTick, reactive, ref, toRefs } from "vue";

import { ElMessage } from "element-plus";

import { allocatingAssignment } from "@/api/project";

export default defineComponent({
  emits: ["refresh"],
  props: { users: Array },
  setup(props, { emit }) {
    // const userdata = toRef(props, "user");
    const refForm = ref();
    const refCascader = ref();
    const data = reactive({
      loading: false,
      visible: false,
      pointPosition: {
        pointPositionId: "",
        pointPositionName: "",
        clientId: "",
        ip: "",
        userId: "",
        address: "",
        type: "",
        peopleNumbers: "",
        scheduledTime: "",
        implementerId: "",
        cpeName: "",
        status: 0,
        dataLink: "",
      },
    });

    const rules = reactive(
      (function () {
        return {
          scheduledTime: [
            { required: true, message: "请选择实施时间", trigger: "blur" },
          ],
          implementerId: [
            { required: true, message: "请选择实施人员", trigger: "blur" },
          ],
        };
      })()
    );

    const init = async (pointPosition) => {
      if (pointPosition) {
        data.pointPosition = JSON.parse(JSON.stringify(pointPosition));
      } else {
        data.pointPosition = {};
      }
      data.visible = true;
      data.loading = false;
      nextTick(() => {
        data.loading = false;
      });
    };

    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const submit = () => {
      refForm.value.validate(async (valid) => {
        if (valid) {
          const r = await allocatingAssignment(data.pointPosition);
          if (r) {
            data.visible = false;
            ElMessage({
              message: "操作成功!",
              type: "success",
            });
            emit("refresh");
          }
        }
      });
    };

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const dialogClosedHandle = () => {
      refForm.value.resetFields();
    };

    return {
      refForm,
      refCascader,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
    };
  },
});
</script>
