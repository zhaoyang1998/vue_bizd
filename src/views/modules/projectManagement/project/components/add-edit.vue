<template>
  <el-dialog
    width="450px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      v-loading="loading"
      :model="project"
      :rules="rules"
      label-width="auto"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="left"
      require-asterisk-position="right"
    >
      <el-form-item label="单位名称 必填" prop="pointPositionName">
        <el-input v-model="project.pointPositionName" placeholder="单位名称" />
      </el-form-item>
      <el-form-item label="所属客户" prop="clientId">
        <el-select
          v-model="project.clientId"
          clearable
          placeholder="请选择所属客户ID"
        >
          <el-option label="ccic" value="1" />
          <el-option label="hx-shuini" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位地址 必填" prop="address">
        <el-input v-model="project.address" placeholder="单位地址" />
      </el-form-item>
      <el-form-item label="实施类型" prop="type">
        <el-select
          v-model="project.type"
          clearable
          placeholder="请选择实施类型"
        >
          <el-option label="调研中" value="0" />
          <el-option label="正式实施" value="1" />
          <el-option label="POC" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="办公人数" prop="seopleNumbers">
        <el-input
          v-model.number="project.peopleNumbers"
          placeholder="办公人数"
        />
      </el-form-item>
      <el-form-item label="预计实施时间">
        <el-col :span="11">
          <el-date-picker
            type="datetime"
            v-model="project.scheduledTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </el-col>
        <!-- <el-col :span="2"> </el-col>
        <el-col :span="11">
          
          <el-time-picker v-model="project.scheduledTime" placeholder="请选择时间" style="width: 100%" />
        </el-col> -->
      </el-form-item>
      <el-form-item label="实施人员" prop="implementerId">
        <el-select
          v-model="project.implementerId"
          clearable
          placeholder="请选择实施人员"
        >
          <el-option label="罗进" value="0" />
          <el-option label="龙玉宇" value="1" />
          <el-option label="刘明明" value="2" />
          <el-option label="李佳欣" value="3" />
          <el-option label="王羡" value="4" />
          <el-option label="祝贞涛" value="5" />
          <el-option label="陈逢金" value="6" />
        </el-select>
      </el-form-item>
      <el-form-item label="ip段规划" prop="ip">
        <el-input v-model="project.ip" placeholder="ip段规划" />
      </el-form-item>
      <el-form-item label="设备别名" prop="cpeName">
        <el-input v-model="project.cpeName" placeholder="设备别名" />
      </el-form-item>
      <el-form-item label="实施资料链接" prop="dataLink">
        <el-input v-model="project.dataLink" placeholder="实施资料链接" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleAddPointPosition()"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  toRef,
} from "vue";

import { ElMessage } from "element-plus";

import { globalSelectListApi } from "@/api/enterprise-menu";
import { globalInfoApi, globalAddApi, globalEditApi } from "@/api/role";

import { addPointPosition } from "@/api/project";

export default defineComponent({
  emits: ["refresh"],
  props: { user: Array },
  setup(props, { emit }) {
    // const userdata = toRef(props, "user");
    console.log(props);

    const refForm = ref();
    const refCascader = ref();
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        id: null,
        name: "",
        remark: "",
        enterprise_menu_ids: [],
        enterprise_id: "",
      },
      menus: [],
      project: {
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
        // implementerName: "",
        cpeName: "",
        status: 0,
        dataLink: "",
      },
    });

    const handleAddPointPosition = async () => {
      const addProject = data.project;
      await addPointPosition(addProject);
      data.visible = false;
    };

    const rules = reactive(
      (function () {
        return {
          pointPositionName: [
            { required: true, message: "请输入单位名称", trigger: "blur" },
          ],
          address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        };
      })()
    );

    const cascaderProps = computed(() => {
      const reuslt = {
        multiple: true,
        emitPath: false,
        checkStrictly: false,
        value: "id",
        label: `name_cn`,
        children: "children",
      };
      return reuslt;
    });

    const init = async (enterpriseId, id) => {
      data.visible = true;
      data.loading = false;
      data.form.enterprise_id = enterpriseId;
      data.form.id = id;

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
          // 处理已选 菜单 权限
          const checkedNodes = refCascader.value.getCheckedNodes(true);
          const enterpriseMenuIds = [];
          checkedNodes.forEach((item) => {
            enterpriseMenuIds.push.apply(enterpriseMenuIds, item.pathValues);
          });
          data.form.enterprise_menu_ids = Array.from(
            new Set(enterpriseMenuIds)
          ).filter((item) => item !== 0);
          const r = data.form.id
            ? await globalEditApi(data.form)
            : await globalAddApi(data.form);
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
      cascaderProps,
      init,
      submit,
      dialogClosedHandle,
      handleAddPointPosition,
    };
  },
});
</script>
