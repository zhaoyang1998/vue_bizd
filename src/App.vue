<template>
  <el-config-provider :locale="locale" :size="size" :z-index="zIndex">
    <View v-if="!reload" />
  </el-config-provider>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import View from '@/components/view/index.vue'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  components: { View },
  setup() {
    const store = useStore()

    store.dispatch('theme/getTheme')

    store.dispatch('settings/getLayout')

    const reload = computed({
      get: () => {
        return store.state.theme.reload
      },
      set: (val) => {
        store.dispatch('theme/setReload', val)
      }
    })

    return {
      locale: zhCn,
      size: 'default',
      zIndex: 3000,
      reload
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
  font-size: 12px;
  font-variant: tabular-nums;
  font-variant-ligatures: normal;
  font-variant-numeric: tabular-nums;
  font-variant-east-asian: normal;
  font-variant-caps: normal;
  font-variant-alternates: normal;  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  display: flex;
  color: var(--el-text-color-primary);
}
</style>
