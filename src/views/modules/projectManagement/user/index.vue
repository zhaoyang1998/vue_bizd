<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <EnterpriseSidebar v-model="active" @change="changeHandle" />
    </template>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input
            v-model="search.keyword"
            placeholder="用户名/企业微信名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="searchUser()">搜索</el-button>
          <el-button v-repeat @click="clearJson(search), reacquireHandle()"
            >重置</el-button
          >
          <el-button type="primary" @click="addEditHandle()">新增</el-button>
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
        <el-table-column align="center" label="用户名" prop="userName" />
        <el-table-column align="center" label="账号" prop="userAccount" />
        <el-table-column align="center" label="人员类型" prop="typeName" />
        <el-table-column align="center" label="企业微信" prop="wxName" />
        <el-table-column align="center" label="工作量" prop="currentWorkload" />
        <el-table-column align="center" label="优先级" prop="priority" />
        <el-table-column align="center" label="操作" width="110" fixed="right">
          <template v-slot="{ row }">
            <el-button type="primary" link @click="addEditHandle(row)"
              >编辑</el-button
            >
            <el-button type="danger" link @click="deleteHandle(row.userId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <AddEdit ref="refAddEdit" v-if="visible" @refresh="reacquireHandle()" />
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

import { globalSetShowApi } from "@/api/role";

import { delUser, getAllUser, getUsersByKeyword } from "@/api/user";

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
      selection: [],
      user: [],
      search: {
        pageSize: page.size,
        pageNumber: page.current,
        keyword: null,
      },
    });
    const pagination = {
      pageSize: page.size,
      pageNumber: page.current,
    };

    const handleGetAllUser = async (params) => {
      const u = await getAllUser(params);
      data.user = JSON.parse(u.data);
      page.current = u.cur;
      page.total = u.total;
    };
    const searchUser = async () => {
      const search = data.search;
      search.pageSize = pagination.pageSize;
      search.pageNumber = pagination.pageNumber;
      const c = await getUsersByKeyword(search);
      data.user = JSON.parse(c.data);
      page.current = c.cur;
      page.total = c.total;
    };
    const reacquireHandle = () => {
      pagination.pageNumber = 1;
      handleGetAllUser(pagination);
    };

    const addEditHandle = (id) => {
      data.visible = true;
      nextTick(() => {
        refAddEdit.value.init(id);
      });
    };

    const deleteHandle = (id) => {
      const ids = id ? [id] : data.selection.map((item) => item.userId);
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
          delUser({ keys: ids })
            .then((r) => {
              if (r) {
                ElMessage({
                  message: "操作成功!",
                  type: "success",
                });
              }
            })
            .then(() => {
              reacquireHandle();
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
      pagination.pageNumber = page.current;
      pagination.pageSize = page.size;
      handleGetAllUser(pagination);
    };

    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop();
      reacquireHandle();
    };

    onMounted(async () => {
      await handleGetAllUser(pagination);
    });

    return {
      refContainerSidebar,
      refForm,
      refTable,
      refAddEdit,
      page,
      pagination,
      ...toRefs(data),
      reacquireHandle,
      addEditHandle,
      deleteHandle,
      showHandle,
      selectionHandle,
      pageChangeHandle,
      changeHandle,
      clearJson,
      handleGetAllUser,
      searchUser,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
