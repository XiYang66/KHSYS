<!--
 * @Author: XC
 * @Date: 2024-09-09 11:00:54
 * @LastEditors: XC
 * @LastEditTime: 2024-09-11 15:42:17
 * @Description: file information
 * @Company: kan-tian
-->
<template>
  <div class="myEditor">
    <div id="container" ref="container"></div>
  </div>
</template>
  <script setup>
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

import { defineProps, onMounted,watch,ref,defineExpose } from "vue";
let theme = "vs-dark";
let monacoEditor = ref(null);
let container = ref()

// onMounted(()=>{
//   initEditor()
// })
let props = defineProps({
  codes: {
    type: String,
    default: function () {
      return "";
    },
  },
  language: {
    default: "javascript",
  },
  fontSize: {
    default: 20,
  },
  editorOptions: {
    type: Object,
    default: function () {
      return {
        foldingStrategy: "indentation", // 代码可分小段折叠
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false, // 只读
        cursorStyle: "BlockOutline", // 光标样式
        automaticLayout: false, // 自动布局
        glyphMargin: true, // 字形边缘
        useTabStops: false,
        fontSize: 28, // 字体大小
        tabSize: 2, // tab 缩进长度
        autoIndent: true, // 自动布局
      };
    },
  },
});
watch( () =>props.codes,()=> {
  monacoEditor.value.setValue(props.codes);
});
const initEditor = () => {
  container.value.innerHTML = "";
  monacoEditor.value = monaco.editor.create(container.value, {
    value: props.codes,
    language: props.language,
    theme: theme,
    editorOptions: props.editorOptions,
  });
  // monacoEditor.value.onDidChangeModelContent((event) => {
  //   this.codesCopy = monacoEditor.value.getValue();
  //   this.$emit("onCodeChange", monacoEditor.value.getValue(), event);
  // });
  // this.$emit("onMounted", monacoEditor.value);
};
defineExpose({initEditor})
</script>
<style scoped>

#container {
  width: 400px;
  height: 400px;
  text-align: left;
}
</style>
  