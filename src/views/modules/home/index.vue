<template>
  <ContainerCustom>
    <template #default>
      <div class="panel margin-20 width-150">
        <el-form-item>
          <el-select
            clearable
            placeholder="请选择客户"
            v-model="clientId"
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
      </div>
      <div class="home-container flex-box flex_w-wrap margin-10">
        <Introduction
          :option="totalOption"
          class="flex-item_f-3 margin-10"
          ref="refTotal"
        />
        <Interacted
          :option="dayOption"
          class="flex-item_f-3 margin-10"
          ref="refDay"
        />
        <div class="width-full flex-box">
          <Advertisement
            :option="efficiencyOption"
            class="margin-10 flex-item_f-1"
            style="magrin: auto"
            ref="refEfficiency"
          />
        </div>
      </div>
    </template>
  </ContainerCustom>
</template>

<script >
import {
  defineComponent,
  reactive,
  onMounted,
  toRefs,
  ref,
  nextTick,
} from "vue";

import ContainerCustom from "@/components/container-custom/index.vue";
import Introduction from "./components/introduction.vue";
import Interacted from "./components/interacted.vue";
import Advertisement from "./components/advertisement.vue";
import { getAllClients } from "@/api/client";
import { getHomePageData } from "@/api/home";
export default defineComponent({
  components: { ContainerCustom, Introduction, Interacted, Advertisement },
  setup() {
    const refTotal = ref();
    const refDay = ref();
    const refEfficiency = ref();
    const data = reactive({
      clients: [],
      clientId: "",
    });
    let efficiencyOption = reactive({});
    let totalOption = reactive({});
    let dayOption = reactive({});
    const handleGetAllClient = async () => {
      const u = await getAllClients();
      data.clients = JSON.parse(u.data);
      data.clientId = data.clients[0].clientId;
      data.clientName = data.clients[0].clientName;
    };
    const changeClient = async (clientId) => {
      const u = await getHomePageData(clientId);
      const tmp = JSON.parse(u.data);
      totalOption = tmp.totalData;
      dayOption = tmp.curData;
      if (tmp.efficiencyData.flag) {
        efficiencyOption = tmp.nullEcharts;
      } else {
        efficiencyOption = tmp.efficiencyData;
      }
      nextTick(() => {
        refTotal.value.init(totalOption);
        refDay.value.init(dayOption);
        refEfficiency.value.init(efficiencyOption);
      });
    };
    onMounted(async () => {
      await handleGetAllClient();
      await changeClient(data.clientId);
    });
    return {
      efficiencyOption,
      totalOption,
      dayOption,
      ...toRefs(data),
      changeClient,
      refTotal,
      refDay,
      refEfficiency,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel {
  height: fit-content;
  border-radius: var(--el-border-radius-base);
  background-color: var(--gl-content-panel-background-color);
  &-title {
    font-weight: 700;
  }
  &-content {
    .el-image + .el-image {
      margin-left: 10px;
    }
    p {
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
