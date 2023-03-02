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
            placeholder="点位名称\地址\设备别名\IP"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="searchPointPosition()">搜索</el-button>
          <el-button v-repeat @click="clearJson(search), reacquireHandle()"
            >重置</el-button
          >
          <el-button
            type="primary"
            @click="addEditHandle(), handleGetAllClient()"
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
        :data="pointPosition"
        @selection-change="selectionHandle"
        stripe
        border
      >
        <el-table-column fixed align="center" type="selection" width="50" />
        <el-table-column
          align="center"
          label="所属客户"
          prop="clientAbbreviation"
        />
        <el-table-column
          align="center"
          label="点位名称"
          prop="pointPositionName"
        />
        <el-table-column align="center" label="地址" prop="address" />
        <el-table-column align="center" label="办公人数" prop="peopleNumbers" />
        <el-table-column
          align="center"
          label="实施人员"
          prop="implementerName"
        />
        <el-table-column align="center" label="ip网段" prop="ip" />
        <el-table-column align="center" label="设备别名" prop="cpeName" />
        <el-table-column align="center" label="状态" prop="statusName" />
        <el-table-column align="center" label="数据来源" prop="userName" />
        <el-table-column
          align="center"
          label="实施资料链接"
          prop="dataLink"
          min-width="140"
        >
          <template #default="scope">
            <a :href="scope.row.dataLink" target="_blank">{{
              scope.row.dataLink
            }}</a>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="预计实施时间"
          prop="scheduledTime"
          min-width="150"
        />
        <el-table-column
          align="center"
          label="开始时间"
          prop="startTime"
          min-width="150"
        />
        <el-table-column
          align="center"
          label="结束时间"
          prop="endTime"
          min-width="150"
        />
        <el-table-column align="center" label="备注" prop="remark" />
        <el-table-column
          align="center"
          label="状态扭转"
          fixed="right"
          width="110"
        >
          <template #default="scope">
            <el-button
              type="success"
              v-if="
                (scope.row.status % 10 === 0) & (scope.row.implementerId !== '')
              "
              link
              style="margin-left: 12px"
              @click="start(scope.row)"
              >开始实施</el-button
            >
            <el-button
              type="primary"
              v-if="
                (scope.row.status % 10 === 0) & (scope.row.implementerId === '')
              "
              link
              style="margin-left: 12px"
              @click="allocating(scope.row), handleGetDeliveryUsers()"
              >实施分配</el-button
            >
            <el-button
              type="warning"
              v-if="scope.row.status % 10 === 1"
              link
              style="margin-left: 12px"
              @click="finish(scope.row.pointPositionId)"
              >实施完成</el-button
            >
            <el-button
              type="danger"
              v-if="
                (scope.row.status % 10 === 1) |
                  ((scope.row.implementerId !== '') &
                    (scope.row.status % 10 !== 2))
              "
              link
              style="margin-left: 12px"
              @click="cancel(scope.row)"
              >取消实施</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="140" fixed="right">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              link
              style="margin-left: 12px"
              @click="addEditHandle(row), handleGetAllClient()"
              >编辑</el-button
            >
            <el-button
              type="danger"
              link
              style="margin-left: 12px"
              @click="deleteHandle(row.pointPositionId)"
              >删除</el-button
            >
            <!-- <el-button
              type="primary"
              link
              style="margin-left: 12px"
              @click="showDetail(row.pointPositionId)"
              >实施详情</el-button
            > -->
            <el-button
              type="success"
              link
              style="margin-left: 12px"
              v-if="row.status % 10 !== 0"
              @click="viewDetail(row.pointPositionId)"
              >实施概览</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <AddEdit
        ref="refAddEdit"
        v-if="visible"
        @refresh="reacquireHandle()"
        :clients="clients"
      />
      <StatusChange
        ref="refStatusChange"
        v-if="visible"
        @refresh="reacquireHandle()"
        :users="users"
      />
      <Drawer ref="refDrawer"></Drawer>
      <ViewDetail ref="refViewDetail"></ViewDetail>
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
import StatusChange from "./components/status-change.vue";
import Drawer from "./components/drawer.vue";
import ViewDetail from "./components/view-detail.vue";
import usePage from "@/mixins/page";
import { clearJson } from "@/utils";

import { globalSetShowApi } from "@/api/role";

import {
  getAllPointPosition,
  getPointPositionByKeyword,
  delPointPosition,
  startAssignment,
  finishAssignment,
  cancelAssignment,
} from "@/api/project";
import { getAllClients } from "@/api/client";
import { getDeliveryUser } from "@/api/user";
export default defineComponent({
  components: {
    ContainerSidebar,
    EnterpriseSidebar,
    AddEdit,
    StatusChange,
    Drawer,
    ViewDetail,
  },
  setup() {
    const refContainerSidebar = ref();
    const refForm = ref();
    const refTable = ref();
    const refAddEdit = ref();
    const refViewDetail = ref();
    const refStatusChange = ref();
    const refDrawer = ref();
    const { page } = usePage();
    const data = reactive({
      active: "",
      loading: false,
      visible: false,
      search: {
        pageSize: page.size,
        pageNumber: page.current,
        keyword: null,
      },
      selection: [],
      pointPosition: [],
    });
    const users = ref([]);
    const clients = ref([]);
    const pagination = reactive({
      pageSize: page.size,
      pageNumber: page.current,
    });
    const searchPointPosition = async () => {
      const search = data.search;
      search.pageSize = pagination.pageSize;
      search.pageNumber = pagination.pageNumber;
      const c = await getPointPositionByKeyword(search);
      data.pointPosition = JSON.parse(c.data);
      page.current = c.cur;
      page.total = c.total;
    };
    const handleGetAllPointPosition = async (params) => {
      const p = await getAllPointPosition(params);
      data.pointPosition = JSON.parse(p.data);
      page.current = p.cur;
      page.total = p.total;
    };
    const handleGetAllClient = async () => {
      const u = await getAllClients();
      clients.value = JSON.parse(u.data);
    };
    const handleGetDeliveryUsers = async () => {
      const u = await getDeliveryUser();
      users.value = JSON.parse(u.data);
    };
    const reacquireHandle = () => {
      pagination.pageNumber = 1;
      handleGetAllPointPosition(pagination);
    };
    const addEditHandle = (pointPosition) => {
      data.visible = true;
      nextTick(() => {
        refAddEdit.value.init(pointPosition);
      });
    };
    const showDetail = (pointPositionId) => {
      nextTick(() => {
        refViewDetail.value.init(pointPositionId, true);
      });
    };
    const viewDetail = (pointPositionId) => {
      nextTick(() => {
        refViewDetail.value.init(pointPositionId, false);
      });
    };
    const start = async (pointPosition) => {
      const r = await startAssignment(pointPosition);
      if (r) {
        ElMessage({
          message: "操作成功!",
          type: "success",
        });
        nextTick(() => {
          viewDetail(pointPosition.pointPositionId);
        });
      }
      reacquireHandle();
    };
    const allocating = (pointPosition) => {
      data.visible = true;
      nextTick(() => {
        refStatusChange.value.init(pointPosition);
      });
    };
    const finish = async (id) => {
      const r = await finishAssignment(id);
      if (r) {
        ElMessage({
          message: "操作成功!",
          type: "success",
        });
      }
      reacquireHandle();
    };
    const cancel = async (pointPosition) => {
      const r = await cancelAssignment(pointPosition);
      if (r) {
        ElMessage({
          message: "操作成功!",
          type: "success",
        });
      }
      reacquireHandle();
    };
    const deleteHandle = (id) => {
      const ids = id
        ? [id]
        : data.selection.map((item) => item.pointPositionId);
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
          delPointPosition({ keys: ids })
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
      handleGetAllPointPosition(pagination);
    };
    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop();
      reacquireHandle();
    };
    onMounted(async () => {
      await handleGetAllPointPosition(pagination);
    });

    return {
      refContainerSidebar,
      refForm,
      refTable,
      refAddEdit,
      refStatusChange,
      refDrawer,
      refViewDetail,
      page,
      users,
      clients,
      ...toRefs(data),
      reacquireHandle,
      addEditHandle,
      deleteHandle,
      showHandle,
      selectionHandle,
      pageChangeHandle,
      changeHandle,
      clearJson,
      handleGetAllPointPosition,
      handleGetAllClient,
      searchPointPosition,
      start,
      allocating,
      finish,
      cancel,
      handleGetDeliveryUsers,
      showDetail,
      viewDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
