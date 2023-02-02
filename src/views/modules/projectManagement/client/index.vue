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
          <el-button v-repeat @click="handleGetAllClient()">搜索</el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()"
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
        :data="client"
        @selection-change="selectionHandle"
        border
      >
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="客户名称" prop="clientName" />
        <el-table-column
          align="center"
          label="客户简称"
          prop="clientAbbreviation"
        />
        <el-table-column align="center" label="客户链接资料" prop="dataLink" />
        <el-table-column align="center" label="联系人" prop="principalId" />
        <el-table-column align="center" label="实施状态" prop="status" />
        <el-table-column align="center" label="操作" width="110" fixed="right">
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
        </el-table-column>
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
import { getAllClient } from "@/api/client";

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
      client: [],
    });
    const pagination = {
      pageSize: page.size,
      pageNumber: page.current,
    };

    const handleGetAllClient = async (params) => {
      const c = await getAllClient(params);
      data.client = JSON.parse(c.data);
      page.current = c.cur;
      page.total = c.total;
      console.log(page);
    };

    const reacquireHandle = () => {
      page.current = 1;
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
      pagination.pageNumber = page.current;
      pagination.pageSize = page.size;
      handleGetAllClient(pagination);
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
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
