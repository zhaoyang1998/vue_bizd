<template>
  <el-dialog
    width="450px"
    :title="client.clientId ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      v-loading="loading"
      :model="client"
      :rules="rules"
      label-width="auto"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="left"
      require-asterisk-position="right"
    >
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="client.clientName" placeholder="单位名称" />
      </el-form-item>
      <el-form-item label="客户简称" prop="clientAbbreviation">
        <el-input v-model="client.clientAbbreviation" placeholder="客户简称" />
      </el-form-item>
      <el-form-item label="负责人" prop="principalId">
        <el-select
          v-model="client.principalId"
          clearable
          placeholder="请选择负责人"
        >
          <el-option
            :key="item"
            :label="item.userName"
            :value="item.userId"
            v-for="item in users"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="canvas账号" prop="canvasAccount">
        <el-input v-model="client.canvasAccount" placeholder="canvas账号" />
      </el-form-item>
      <el-form-item label="canvas密码" prop="canvasPwd">
        <el-input v-model="client.canvasPwd" placeholder="canvas密码" />
      </el-form-item>
      <el-form-item label="资料链接" prop="dataLink">
        <el-input v-model="client.dataLink" placeholder="资料链接" />
      </el-form-item>
      <el-form-item
        label="类型"
        prop="status"
        v-if="client.status % 10 === 0 || !client.clientId"
      >
        <el-select v-model="client.status" clearable placeholder="请选择类型">
          <el-option label="实施" :value="10" />
          <el-option label="POC" :value="20" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="statusName" v-else>
        <el-input v-model="client.statusName" :disabled="true" />
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
import { addClient, updateClient } from "@/api/client";

export default defineComponent({
  emits: ["refresh"],
  props: { users: Array },
  setup(props, { emit }) {
    const refForm = ref();
    const data = reactive({
      loading: false,
      visible: false,
      tmp: {},
      client: {
        clientId: "",
        clientName: "",
        clientAbbreviation: "",
        canvasAccount: "",
        canvasPwd: "",
        dataLink: "",
        status: "",
      },
    });

    const rules = reactive(
      (function () {
        return {
          clientName: [
            {
              required: true,
              message: "客户名称不能为空",
              trigger: "blur",
            },
          ],
          clientAbbreviation: [
            { required: true, message: "客户简称不能为空", trigger: "blur" },
          ],
          status: [
            { required: true, message: "请选择实施状态", trigger: "blur" },
          ],
        };
      })()
    );

    const init = async (client) => {
      console.log(props.users);
      if (client) {
        data.client = JSON.parse(JSON.stringify(client));
      } else {
        data.client = {};
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
          const r = data.client.clientId
            ? await updateClient(data.client)
            : await addClient(data.client);
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
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
    };
  },
});
</script>
