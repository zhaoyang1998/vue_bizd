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
        />
      </el-form-item>
      <el-form-item label="单位地址" prop="address">
        <el-input v-model="pointPosition.address" placeholder="单位地址" />
      </el-form-item>
      <el-form-item label="所属客户" prop="clientId">
        <el-select
          v-model="pointPosition.clientId"
          clearable
          :disabled="
            pointPosition.status % 10 !== 0 && pointPosition.pointPositionId
          "
          placeholder="请选择所属客户"
        >
          <el-option
            v-for="item in clients"
            :key="item"
            :label="item.clientAbbreviation"
            :value="item.clientId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="userId">
        <el-select
          v-model="pointPosition.userId"
          clearable
          placeholder="请选择负责人"
          :disabled="
            pointPosition.status % 10 !== 0 && pointPosition.pointPositionId
          "
        >
          <el-option
            :key="item"
            :label="item.userName"
            :value="item.userId"
            v-for="item in users"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="pointPosition.type"
          clearable
          placeholder="请选择实施类型"
          :disabled="pointPosition.status % 10 !== 0 && pointPosition.status"
        >
          <el-option label="调研" :value="1" />
          <el-option label="实施" :value="2" />
          <el-option label="POC" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="IP网段" prop="ip">
        <el-input v-model="pointPosition.ip" placeholder="IP网段" />
      </el-form-item>
      <el-form-item label="设备别名" prop="cpeName">
        <el-input v-model="pointPosition.cpeName" placeholder="设备别名" />
      </el-form-item>
      <el-form-item label="实施资料链接" prop="dataLink">
        <el-input v-model="pointPosition.dataLink" placeholder="实施资料链接" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="pointPosition.remark" placeholder="备注" />
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

import { addPointPosition, updatePointPosition } from "@/api/project";
import { getAllClients } from "@/api/client";
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
        scheduledTime: "",
        implementerId: "",
        cpeName: "",
        status: 0,
        dataLink: "",
      },
      clients: [],
    });

    const rules = reactive(
      (function () {
        return {
          pointPositionName: [
            { required: true, message: "请输入单位名称", trigger: "blur" },
          ],
          address: [{ required: true, message: "请输入地址", trigger: "blur" }],
          clientId: [
            { required: true, message: "请选择所属客户", trigger: "blur" },
          ],
          type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        };
      })()
    );

    const init = async (pointPosition) => {
      await handleGetAllClientsAndUsers();
      if (pointPosition) {
        data.pointPosition = JSON.parse(JSON.stringify(pointPosition));
      } else {
        data.pointPosition = {};
      }
      data.visible = true;
      nextTick(() => {
        data.loading = false;
      });
    };

    const handleGetAllClientsAndUsers = async () => {
      const u = await getAllClients();
      data.clients = JSON.parse(u.data);
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
          const info = data.pointPosition.pointPositionId
            ? " "
            : "请注意分配实施人员！";
          const r = data.pointPosition.pointPositionId
            ? await updatePointPosition(data.pointPosition)
            : await addPointPosition(data.pointPosition);
          if (r) {
            data.visible = false;
            ElMessage({
              message: "操作成功!" + info,
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
      handleGetAllClientsAndUsers,
      dialogClosedHandle,
    };
  },
});
</script>
