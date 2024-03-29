<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <EnterpriseSidebar v-model="search.keyword" @change="changeHandle" />
    </template>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input
            v-model="search.keyword"
            placeholder="客户名称/简称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="searchClient()">搜索</el-button>
          <el-button v-repeat @click="clearJson(search), reacquireHandle()"
            >重置</el-button
          >
          <el-button
            type="primary"
            @click="addEditHandle(), handleGetAllUsers()"
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
        :data="client"
        @selection-change="selectionHandle"
        border
      >
        <el-table-column
          align="center"
          type="selection"
          width="50"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="客户名称"
          prop="clientName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="客户简称"
          prop="clientAbbreviation"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="客户链接资料"
          prop="dataLink"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="负责人"
          prop="principalName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="canvas账号"
          prop="canvasAccount"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="canvas密码"
          prop="canvasPwd"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="statusName"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="center" label="操作" width="110" fixed="right">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              link
              @click="addEditHandle(row), handleGetAllUsers()"
              >编辑</el-button
            >
            <el-button type="danger" link @click="deleteHandle(row.clientId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <AddEdit
        ref="refAddEdit"
        :users="users"
        v-if="visible"
        @refresh="reacquireHandle()"
      />
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
import { getAllClient, getClientsByKeyword, delClient } from "@/api/client";
import { getAllUsers } from "@/api/user";

export default defineComponent({
  components: { ContainerSidebar, EnterpriseSidebar, AddEdit },
  setup() {
    const refContainerSidebar = ref();
    const refForm = ref();
    const refTable = ref();
    const refAddEdit = ref();
    const users = ref([]);
    const { page } = usePage();
    const data = reactive({
      loading: false,
      visible: false,
      selection: [],
      client: [],
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
    const handleGetAllUsers = async () => {
      const r = await getAllUsers();
      users.value = JSON.parse(r.data);
    };

    const handleGetAllClient = async (params) => {
      const c = await getAllClient(params);
      data.client = JSON.parse(c.data);
      page.current = c.cur;
      page.total = c.total;
    };

    const searchClient = async () => {
      const search = data.search;
      search.pageSize = pagination.pageSize;
      search.pageNumber = pagination.pageNumber;
      const c = await getClientsByKeyword(search);
      data.client = JSON.parse(c.data);
      page.current = c.cur;
      page.total = c.total;
    };

    const reacquireHandle = () => {
      pagination.pageNumber = 1;
      handleGetAllClient(pagination);
    };

    const addEditHandle = (id) => {
      data.visible = true;
      nextTick(() => {
        refAddEdit.value.init(id);
      });
    };

    const deleteHandle = (id) => {
      const ids = id ? [id] : data.selection.map((item) => item.clientId);
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
          delClient({ keys: ids })
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
      if (data.search.keyword === "") {
        handleGetAllClient(pagination);
      } else {
        searchClient();
      }
    };

    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop();
      reacquireHandle();
    };

    onMounted(async () => {
      await handleGetAllClient(pagination);
    });

    return {
      refContainerSidebar,
      refForm,
      refTable,
      refAddEdit,
      users,
      page,
      ...toRefs(data),
      reacquireHandle,
      addEditHandle,
      deleteHandle,
      showHandle,
      selectionHandle,
      pageChangeHandle,
      changeHandle,
      clearJson,
      handleGetAllClient,
      searchClient,
      handleGetAllUsers,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
