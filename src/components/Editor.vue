<template>
  <div>
    <div v-show="!this.status">
      <Button type="text" icon="ios-arrow-down"
              :style="{width: '100%',margin:'3px auto'}"
              @click.native="toggleStatus">
        {{ this.buttonTip }}
      </Button>
<!--      <Card></Card>-->
    </div>
    <div v-show="this.status">
      <codemirror
          id="codemirror"
          ref="chartOption"
          v-model="mirrorCode"
          :value="mirrorCode"
          :options="cmOptions"
          :style="{marginTop:'30px'}"
      >
      </codemirror>

      <Button type="text" icon="ios-arrow-up"
              :style="{width: '100%',margin:'0px auto '}"
              @click.native="toggleStatus">
        {{ this.buttonTip }}
      </Button>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror' // 引入组件
// language
// language syntax
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/dockerfile/dockerfile.js'

// theme css
import 'codemirror/theme/monokai.css'

// require active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/selection/active-line.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'


export default {
  name: "Editor",
  components: {
    codemirror // 声明组件
  },
  props: {
    content: String,
  },
  watch: {
    content(val) {
      if ("" !==val.trim()){
        this.status = true;
        this.buttonTip = ""
      }
      this.mirrorCode = val;
    }
  },
  data() {
    return {
      status: false,
      buttonTip: 'Show Code',
      mirrorCode: this.content,
      cmOptions: {
        tabSize: 2, // Tab键空格数
        mode: "text/x-yaml", //模式
        foldGutter: true, // 块槽
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        theme: 'monokai', // 主题
        lineNumbers: true, //是否显示行号
        line: true,
        scrollbarStyle: "null",
      },
    }
  },
  methods: {
    toggleStatus() {
      this.status = !this.status;
      this.buttonTip = this.status === true ? "" : "Show Code";
    },
  },
}
</script>

<style scoped>

</style>