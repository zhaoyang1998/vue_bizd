<template>
  <el-dialog
    width="450px"
    :title="user.userId ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      v-loading="loading"
      :model="user"
      :rules="rules"
      label-width="auto"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="left"
      require-asterisk-position="right"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="user.userName" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="账号" prop="userAccount" v-if="!user.userId">
        <el-input v-model="user.userAccount" placeholder="账号" />
      </el-form-item>
      <el-form-item label="密码" prop="userPwd" v-if="!user.userId">
        <el-input v-model="user.userPwd" placeholder="密码" type="password" />
      </el-form-item>
      <el-form-item label="再次输入密码" prop="userTmpPwd" v-if="!user.userId">
        <el-input
          v-model="user.userTmpPwd"
          placeholder="再次输入密码"
          type="password"
        />
      </el-form-item>
      <el-form-item label="企业微信名称" prop="wxName">
        <el-input v-model="user.wxName" placeholder="企业微信名" />
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="user.priority" placeholder="优先级" />
      </el-form-item>
      <el-form-item label="人员类型" prop="type">
        <el-select v-model="user.type" clearable placeholder="请选择人员类型">
          <el-option label="交付" :value="1" />
          <el-option label="项目经理" :value="2" />
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
import { addUser, updateUser } from "@/api/user";
export default defineComponent({
  emits: ["refresh"],
  setup(props, { emit }) {
    const refForm = ref();
    const data = reactive({
      loading: false,
      visible: false,
      tmp: {},
      user: {
        userId: "",
        userAccount: "",
        userName: "",
        userPwd: "",
        userTmpPwd: "",
        wxName: "",
        type: "",
        priority: "",
      },
    });
    const rules = reactive(
      (function () {
        return {
          userAccount: [
            { required: true, message: "账号不能为空", trigger: "blur" },
          ],
          userName: [
            { required: true, message: "用户名不能为空", trigger: "blur" },
          ],
          userPwd: [
            { required: true, message: "密码不能为空", trigger: "blur" },
          ],
          wxName: [
            {
              required: true,
              message: "企业微信名称不能为空",
              trigger: "blur",
            },
          ],
          userTmpPwd: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: (rule, value, callback) => {
                if (value === "") {
                  callback(new Error("请再次输入密码"));
                } else if (value !== data.user.userPwd) {
                  callback(new Error("密码不一致"));
                } else {
                  callback();
                }
              },
            },
          ],
          type: [{ required: true, message: "人员类型", trigger: "blur" }],
        };
      })()
    );
    const init = async (user) => {
      if (user) {
        data.user = JSON.parse(JSON.stringify(user));
      } else {
        data.user = {};
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
          const r = data.user.userId
            ? await updateUser(data.user)
            : await addUser(data.user);
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
