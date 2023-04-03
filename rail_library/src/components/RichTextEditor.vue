<template>
  <div class="edit_container">
    <!--  新增时输入 -->
    <quill-editor
      v-model="value.content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @change="onEditorChange"
      v-if="showInput"
    >
    </quill-editor>
    <!-- 从数据库读取展示 -->
    <!-- <div v-html="str" class="ql-editor" v-if="showContent">{{ str }}1</div> -->
    <div class="content-wrapper">
      <div v-html="value.content" v-if="showContent"></div>
    </div>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  model: {
    event: 'change',
  },
  props: {
    showInput: {
      type: Boolean,
      default: true,
    },
    showContent: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Object,
    },
  },
  components: {
    quillEditor,
  },
  data() {
    return {
      str: '',
      editorOption: {},
    }
  },
  methods: {
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      return str
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    },
  },
  mounted() {
    // this.$nextTick().then(() => {
    //   this.str = this.escapeStringHTML(this.value.content)
    // })
  },
}
</script>
<style lang="less">
.ql-toolbar.ql-snow + .ql-container.ql-snow {
  min-height: 500px;
}
.content-wrapper {
  padding: 20px;
}
</style>
