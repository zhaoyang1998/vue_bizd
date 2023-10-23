<template>
  <div ref="Area" class="vanta_area">
    <div
      class="login-container flex-box flex_a_i-center flex_j_c-center"
      style="height: 100%"
    >
      <el-card class="width-500">
        <el-form
          ref="refForm"
          :model="form"
          :rules="rules"
          @keyup.enter="submit()"
        >
          <el-form-item prop="userAccount">
            <el-input v-model="form.userAccount" placeholder="账户" clearable>
              <template #prefix>
                <Iconfont name="user" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="userPwd">
            <el-input
              v-model="form.userPwd"
              placeholder="密码"
              show-password
              clearable
            >
              <template #prefix>
                <Iconfont name="lock" />
              </template>
            </el-input>
          </el-form-item>
          <el-button
            v-repeat
            :loading="loading"
            class="margin_t-20 width-full"
            type="primary"
            @click="submit()"
            >登录</el-button
          >
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  reactive,
  ref,
  toRefs,
  onMounted,
  onBeforeUnmount,
} from "vue";
import * as THREE from "three";
import BIRDS from "vanta/src/vanta.birds";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const Area = ref();
    const refForm = ref();
    let vantaEffect = null;
    const data = reactive({
      loading: false,
      captcha: "",
      form: {
        userAccount: "",
        userPwd: "",
        uuid: "",
        code: "",
      },
    });
    const rules = reactive(
      (function () {
        return {
          userAccount: [
            { required: true, message: "账户不能为空", trigger: "blur" },
          ],
          userPwd: [
            { required: true, message: "密码不能为空", trigger: "blur" },
          ],
        };
      })()
    );

    /**
     * @description: 登录表单提交
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const submit = () => {
      refForm.value.validate((valid) => {
        if (valid) {
          data.loading = true;
          store.dispatch("administrator/login", data.form).then((r) => {
            if (r) {
              router.push({ name: "redirect", replace: true });
            } else {
              nextTick(() => {
                data.loading = false;
              });
            }
          });
        }
      });
    };
    onMounted(() => {
      vantaEffect = BIRDS({
        el: Area.value,
        THREE: THREE,
        //如果需要改变样式，要写在这里
        //因为这里vantaEffect是没有setOptions这个方法的
        color: 0x16212a,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0xc54ac,
        color1: 0xe27a2,
        color2: 0x29aac8,
      });
    });

    onBeforeUnmount(() => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    });
    return {
      refForm,
      ...toRefs(data),
      rules,
      submit,
      Area,
      onBeforeUnmount,
      onMounted,
    };
  },
});
</script>

<style lang="scss">
.login-container {
  input:focus + .el-input__prefix {
    color: var(--el-color-primary);
  }
}
</style>

<style lang="scss">
.login-notify {
  width: 400px;
  .login-notify-content {
    position: relative;
    .tip {
      position: absolute;
      top: -30px;
      left: 40px;
      color: var(--el-color-warning);
    }
    & > div {
      p {
        // font-weight: 700;
        color: var(--el-color-primary);
      }
      b {
        text-indent: 2em;
      }
    }
    p > b {
      color: var(--el-color-danger);
    }
  }
}

.my-background {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.vanta_area {
  width: 100vw;
  height: 100vh;
}
</style>
