<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <EnterpriseSidebar v-model="active" @change="changeHandle" />
    </template>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input v-model="form.name" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="handleGetAllUser()">搜索</el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()"
            >重置</el-button
          >
          <el-button
            type="primary"
            @click="addEditHandle(), handleGetUserByType()"
            >新增</el-button
          >
          <el-button type="danger" @click="deleteHandle()">批量删除</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #default>
      <el-table
        ref="refTable"
        v-loading="loading"
        :data="user"
        @selection-change="selectionHandle"
        border
      >
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="用户名称" prop="userId" />
        <el-table-column align="center" label="人员类型" prop="userName" />
        <el-table-column align="center" label="微信名" prop="wxName" />
        <el-table-column align="center" label="工作量" prop="currentWorkload" />
        <el-table-column align="center" label="优先级" prop="priority" />
        <!-- <el-table-column align="center" label="TYPE" prop="type">
          <template #default>
            <div>{{scope.row.type ? "lalal" : "hehehe"}}</div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column align="center" label="操作" width="110" fixed="right">
          <template v-slot="{ row }">
            <el-button
              v-permission="'global:role:update'"
              type="primary"
              link
              @click="addEditHandle(row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="'global:role:delete'"
              type="danger"
              link
              @click="deleteHandle(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <AddEdit ref="refAddEdit" v-if="visible" @refresh="getList" />
    </template>
    <template #footer>
      <Page :page="page" @change="pageChangeHandle" />
    </template>
  </ContainerSidebar>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted,
} from "vue";

import { ElMessage, ElMessageBox } from "element-plus";
import ContainerSidebar from "@/components/container-sidebar/index.vue";
import EnterpriseSidebar from "@/components/enterprise-sidebar/index.vue";
import AddEdit from "./components/add-edit.vue";

import usePage from "@/mixins/page";
import { clearJson } from "@/utils";

import { globalPageApi, globalDeleteApi, globalSetShowApi } from "@/api/role";

import { getAllUser } from "@/api/user";

export default defineComponent({
  components: { ContainerSidebar, EnterpriseSidebar, AddEdit },
  setup() {
    const refContainerSidebar = ref();
    const refForm = ref();
    const refTable = ref();
    const refAddEdit = ref();

    const { page } = usePage();
    const data = reactive({
      active: "",
      loading: false,
      visible: false,
      form: {
        name: "",
      },
      list: [],
      selection: [],
      user: [],
    });

    const handleGetAllUser = async () => {
      const u = await getAllUser();
      data.user = JSON.parse(u.data);
    };

    const getList = () => {
      if (data.active) {
        const params = {
          id: data.active,
          ...data.form,
          current: page.current,
          size: page.size,
        };
        data.loading = true;
        globalPageApi(params).then((r) => {
          if (r) {
            (data.list = r.data.list), (page.total = r.data.total);
          }
          nextTick(() => {
            data.loading = false;
          });
        });
      }
    };

    const reacquireHandle = () => {
      page.current = 1;
      getList();
    };

    const addEditHandle = (id) => {
      data.visible = true;
      nextTick(() => {
        refAddEdit.value.init(data.active, id);
      });
    };

    const deleteHandle = (id) => {
      const ids = id ? [id] : data.selection.map((item) => item.id);
      ElMessageBox.confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          globalDeleteApi({ keys: ids }).then((r) => {
            if (r) {
              ElMessage({
                message: "操作成功!",
                type: "success",
              });
              getList();
            }
          });
        })
        .catch(() => {
          // to do something on canceled
        });
    };

    const showHandle = (row) => {
      const params = {
        key: row.id,
        value: row.show,
      };
      globalSetShowApi(params).then((r) => {
        if (r) {
          ElMessage({
            message: "操作成功!",
            type: "success",
          });
        } else {
          row.show = row.show === 1 ? 0 : 1;
        }
      });
    };

    const selectionHandle = (val) => {
      data.selection = val;
    };

    const pageChangeHandle = (argPage) => {
      page.current = argPage.current;
      page.size = argPage.size;
      getList();
    };

    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop();
      reacquireHandle();
    };

    onMounted(async () => {
      await handleGetAllUser();
    });

    return {
      refContainerSidebar,
      refForm,
      refTable,
      refAddEdit,
      page,
      ...toRefs(data),
      getList,
      reacquireHandle,
      addEditHandle,
      deleteHandle,
      showHandle,
      selectionHandle,
      pageChangeHandle,
      changeHandle,
      clearJson,
      handleGetAllUser,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
