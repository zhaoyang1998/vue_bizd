<template>
  <div class="tinymce-boxz">
    <el-form ref="refForm" :inline="true" style="text-align: right">
      <el-form-item>
        <span clearable>用户名：{{ customer }}</span>
      </el-form-item>
      <el-form-item>
        <span clearable>点位名称：{{ title }}</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getDoc"
          >Search</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveContent">
          Upload<el-icon class="el-icon--right"><Upload /></el-icon>
        </el-button>
      </el-form-item>
    </el-form>

    <Editor v-model="content" :init="init" />
  </div>
</template>

<script>

import Editor from "@tinymce/tinymce-vue";
import { reactive, ref, toRefs } from "@vue/reactivity";
import { Upload, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { saveContentApi, getDocApi } from "@/api/document";

export default {
  components: {
    Editor,
    Upload,
  },

  created() {},

  setup() {
    const route = useRoute();
    const customer = ref();
    const title = ref();
    const content = ref();
    const pointPositionId = ref();

    const init = async () => {
      title.value = route.query.title;
      customer.value = route.query.customer;
      pointPositionId.value = route.query.pointPositionId;
      getDoc();
    };
    const saveContent = async () => {
      const p = await saveContentApi({
        content: content.value,
        title: title.value,
        customer: customer.value,
        pointPositionId: pointPositionId.value,
      });
      if (p) {
        ElMessage({
          message: "上传文章成功",
          type: "success",
        });
      } else {
        ElMessage.error("上传文章失败");
      }
    };
    const getDoc = async () => {
      const u = await getDocApi({
        content: "",
        title: title.value,
        customer: customer.value,
        pointPositionId: pointPositionId.value,
      });
      console.log(u);
      if (u) {
        content.value = u.data;

        ElMessage({
          message: "获取文章成功",
          type: "success",
        });
      } else {
        ElMessage.error("获取文章失败");
      }
    };
    const tiny = reactive({
      // apiKey: "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc", //https://github.com/tinymce/tinymce-vue/blob/main/src/demo/views/Iframe.vue
      init: {
        content_css: false, // 禁用默认样式表
        fullpage_default_doctype: "<!DOCTYPE html>", // 设置全屏模式的 doctype
        fullpage_default_encoding: "UTF-8", // 设置全屏模式的编码
        fullpage_default_font_size: "16px", // 设置全屏模式的字体大小

        language: "zh_CN", //语言类型
        placeholder: "在这里输入文字", //textarea中的提示信息
        min_width: 320,
        min_height: 220,
        height: "100%", //注：引入autoresize插件时，此属性失效
        resize: "both", //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
        branding: false, //tiny技术支持信息是否显示
        // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
        // elementpath: false, //元素路径是否显示
        // inline: true,   //内联模式
        base_url: "/tinymce",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;", //字体样式
        plugins:
          "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons", //插件配置 axupimgs indent2em
        toolbar: [
          "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ",
          "styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter",
        ], //工具栏配置，设为false则隐藏
        // menubar: "file edit my1", //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”

        // images_upload_url: '/apib/api-upload/uploadimg',  //后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
        // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
        paste_data_images: true, //图片是否可粘贴

        //此处为图片上传处理函数
        images_upload_handler: (blobInfo, success, failure) => {
          // 这里用base64的图片形式上传图片,
          let reader = new FileReader(); //本地预览
          reader.readAsDataURL(blobInfo.blob());
          reader.onloadend = function () {
            const imgbase64 = reader.result;
            success(imgbase64);
          };
        },

        file_picker_types: "file image media", //file image media分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
        // 文件上传处理函数
        file_picker_callback: function (callback, value, meta) {
          // 使用案例http://tinymce.ax-z.cn/general/upload-images.php
          // meta.filetype  //根据这个判断点击的是什么file image media

          let filetype; //限制文件的上传类型,需要什么就添加什么的后缀
          if (meta.filetype === "image") {
            filetype = ".jpg, .jpeg, .png, .gif, .ico, .svg";
          } else if (meta.filetype === "media") {
            filetype = ".mp3, .mp4, .avi, .mov";
          } else {
            filetype =
              ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg";
          }
          let inputElem = document.createElement("input"); //创建文件选择
          inputElem.setAttribute("type", "file");
          inputElem.setAttribute("accept", filetype);
          inputElem.click();
          inputElem.onchange = () => {
            let file = inputElem.files[0]; //获取文件信息

            // 所有都转成base64文件流,来自官方文档https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              // Note: Now we need to register the blob in TinyMCEs image blob
              // registry. In the next release this part hopefully won't be
              // necessary, as we are looking to handle it internally.
              let id = "blobid" + new Date().getTime();
              let blobCache =
                Editor.tinymce.activeEditor.editorUpload.blobCache;
              let base64 = reader.result.split(",")[1];
              let blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              // call the callback and populate the Title field with the file name
              callback(blobInfo.blobUri(), { title: file.name });
            };
          };
        },
      },
    });
    onMounted(async () => {
      await init();
    });
    return {
      content,
      ...toRefs(tiny),
      title,
      customer,
      getDoc,
      saveContent,
    };
  },
};
</script>
<style scoped>
.tinymce-boxz > textarea {
  display: none;
}
</style>
<style>
/* 隐藏apikey没有绑定当前域名的提示 */
.tox-notifications-container .tox-notification--warning {
  display: none !important;
}

.tox.tox-tinymce {
  max-width: 100%;
}
/* 配置全屏z轴 */
.layout-container .navigation-container {
  z-index: 1000;
}
</style>
