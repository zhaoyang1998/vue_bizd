<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <EnterpriseSidebar v-model="active" @change="changeHandle" />
    </template>
    <template #header>
      <el-form
        ref="refForm"
        :inline="true"
        @keyup.enter="reacquireHandle()"
        class="SelfFont"
      >
        <el-form-item label="客户">
          <el-select
            clearable
            placeholder="客户"
            v-model="search.clientId"
            @change="changeClient"
          >
            <el-option
              v-for="item in clients"
              :key="item"
              :label="item.clientAbbreviation"
              :value="item.clientId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select clearable placeholder="客户" v-model="search.status">
            <el-option
              v-for="item in clients"
              :key="item"
              :label="item.clientAbbreviation"
              :value="item.clientId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实施时间">
          <el-input v-model="search.keyword" placeholder="实施时间" clearable />
        </el-form-item>
        <el-form-item label="关键字" width="100px">
          <el-input
            width="300px"
            v-model="search.keyword"
            placeholder="点位名称/地址/设备SN/IP"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="searchPointPosition()">搜索</el-button>
          <el-button v-repeat @click="clearJson(search), reacquireHandle()"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-button
            type="primary"
            @click="addEditHandle(), handleGetAllClientsAndUsers()"
            >新增</el-button
          >
          <el-button type="primary" @click="handleExportExcel()"
            >导出</el-button
          >
          <el-button type="danger" @click="deleteHandle()">批量删除</el-button>
          <el-popover placement="right-start" :width="200" trigger="click">
            <template #reference>
              <el-button slot="reference" type="primary">
                <el-icon><Grid /></el-icon
              ></el-button>
            </template>
            <el-checkbox-group v-model="selected" @change="handleCheckedChange">
              <el-checkbox
                v-for="item in headers"
                :key="item"
                :label="item.attr"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-popover>
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
        tooltip-effect="light"
        :tooltip-options="{ placement: 'top' }"
        border
        class="SelfFont"
      >
        <el-table-column fixed align="center" type="selection" width="50" />
        <el-table-column
          align="center"
          label="客户"
          prop="clientAbbreviation"
          :show-overflow-tooltip="true"
          v-if="headers[1].show"
        />
        <el-table-column
          align="center"
          label="点位名称"
          prop="pointPositionName"
          width="200px"
          show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="地址"
          prop="address"
          width="200px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="办公人数"
          prop="peopleNumbers"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="实施人员"
          prop="implementerName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="ip网段"
          prop="ip"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="设备别名"
          prop="cpeName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="statusName"
          width="120px"
          ><template #default="scope">
            <el-tag
              effect="dark"
              :color="getStatusColor(scope.row.status)"
              disable-transitions
              >{{ scope.row.statusName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="负责人"
          prop="userName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="实施资料链接"
          prop="dataLink"
          min-width="140"
          :show-overflow-tooltip="true"
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
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="开始时间"
          prop="startTime"
          min-width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="结束时间"
          prop="endTime"
          min-width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="备注"
          prop="remark"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="center" label="操作" width="140" fixed="right">
          <template v-slot="{ row }">
            <el-button
              class="fontSize"
              type="primary"
              link
              style="margin-left: 12px"
              @click="addEditHandle(row), handleGetAllClientsAndUsers()"
              >编辑</el-button
            >
            <el-button
              class="fontSize"
              type="danger"
              link
              style="margin-left: 12px"
              @click="deleteHandle(row.pointPositionId)"
              >删除</el-button
            >
            <el-button
              class="fontSize"
              type="success"
              link
              style="margin-left: 12px"
              v-if="row.status % 10 !== 0"
              @click="viewDetail(row.pointPositionId)"
              >实施概览</el-button
            >
            <el-button
              class="fontSize"
              type="success"
              v-if="row.status % 10 === 0 && row.implementerId"
              link
              style="margin-left: 12px"
              @click="start(row)"
              >开始实施</el-button
            >
            <el-button
              class="fontSize"
              type="primary"
              v-if="row.status % 10 === 0 && !row.implementerId"
              link
              style="margin-left: 12px"
              @click="allocating(row), handleGetDeliveryUsers()"
              >实施分配</el-button
            >
            <el-button
              class="fontSize"
              type="warning"
              v-if="row.status % 10 === 1"
              link
              style="margin-left: 12px"
              @click="finish(row.pointPositionId)"
              >实施完成</el-button
            >
            <el-button
              class="fontSize"
              type="danger"
              v-if="
                row.status % 10 === 1 ||
                (row.implementerId && row.status % 10 !== 2)
              "
              link
              style="margin-left: 12px"
              @click="cancel(row)"
              >取消实施</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <AddEdit
        ref="refAddEdit"
        v-if="visible"
        @refresh="reacquireHandle()"
        :clients="clients"
        :users="allUsers"
      />
      <StatusChange
        ref="refStatusChange"
        v-if="visible"
        @refresh="reacquireHandle()"
        :users="users"
      />
      <Drawer ref="refDrawer" class="SelfFont"></Drawer>
      <ViewDetail ref="refViewDetail" class="SelfFont"></ViewDetail>
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
  exportExcel,
} from "@/api/project";
import { getAllClients } from "@/api/client";
import { getDeliveryUser, getAllUsers } from "@/api/user";
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
        clientId: "",
      },
      selection: [],
      pointPosition: [],
      headers: [
        {
          attr: "clientAbbreviation",
          show: 1,
          name: "客户",
        },
        {
          attr: "address",
          show: 1,
          name: "地址",
        },
        {
          attr: "statusName",
          show: 1,
          name: "状态",
        },
        {
          attr: "remark",
          show: 1,
          name: "备注",
        },
        {
          attr: "userName",
          show: 1,
          name: "负责人",
        },
        {
          attr: "implementerName",
          show: 1,
          name: "实施人",
        },
        {
          attr: "pointPositionName",
          show: 1,
          name: "点位名称",
        },
        {
          attr: "startTime",
          show: 1,
          name: "开始时间",
        },
        {
          attr: "endTime",
          show: 1,
          name: "结束时间",
        },
        {
          attr: "scheduledTime",
          show: 1,
          name: "预计实施时间",
        },
      ],
      selected: [],
      clients: [],
      status: [],
    });
    const users = ref([]);
    const allUsers = ref([]);
    const clients = ref([]);
    const status = ref([]);
    const pagination = reactive({
      pageSize: page.size,
      pageNumber: page.current,
    });
    const handleCheckedChange = (val) => {
      console.log(data.selected);
    };
    const getStatusColor = (status) => {
      switch (status % 10) {
        case 0:
          return "#999999";
        case 1:
          return "#409EFF";
        case 2:
          return "#67C23A";
        default:
          return "";
      }
    };
    const handleExportExcel = () => {
      exportExcel(data.search);
    };
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
    const handleGetAllClientsAndUsers = async () => {
      const u = await getAllClients();
      const r = await getAllUsers();
      clients.value = JSON.parse(u.data);
      allUsers.value = JSON.parse(r.data);
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
      const u = await getAllClients();
      data.headers.forEach((e) => {
        if (e.show === 1) {
          data.selected.push(e.attr);
        }
      });
      data.clients = JSON.parse(u.data);
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
      allUsers,
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
      handleGetAllClientsAndUsers,
      searchPointPosition,
      start,
      allocating,
      finish,
      cancel,
      handleGetDeliveryUsers,
      showDetail,
      viewDetail,
      handleExportExcel,
      getStatusColor,
      handleCheckedChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.SelfFont {
  font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica,
    Arial, sans-serif;
  font-size: 12px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  clear: both;
}
.fontSize {
  font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica,
    Arial, sans-serif;
  font-size: 12px;
  font-variant: tabular-nums;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}
</style>
