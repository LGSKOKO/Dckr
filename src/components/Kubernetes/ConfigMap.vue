<template>
  <div>
    <h3>对象名：{{ configMap.metadata.name }}</h3>
    <Card style="background-color: #f5f7f9">
      <Form :label-width="130" :style="{maxWidth:'700px',margin:'0 auto'}" onsubmit="return false;">
        <FormItem label="命名空间">
          <Row>
            <Col span="18">
              <Input v-model="configMap.metadata.namespace" placeholder="输入指定的命名空间"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="添加数据">
          <Row>
            <Col span="18">
              <Input v-model="temp.data.key" placeholder="Enter the key..."/>
            </Col>
          </Row>
          <Row style="margin-top: 10px">
            <Col span="18">
              <Input v-model="temp.data.value.single" placeholder="Enter the value..." v-show="temp.data.isSingle"/>
              <Input v-model="temp.data.value.multiline" type="textarea" :autosize="{minRows: 4,maxRows: 20}"
                     placeholder="提示信息：请在编辑器上，手动输入多行文本类型的数据。" v-show="!temp.data.isSingle" readonly="readonly"></Input>
            </Col>
            <Col span="2" offset="1">
              <i-switch size="large" v-model="temp.data.isSingle">
                <span slot="open">单行</span>
                <span slot="close">多行</span>
              </i-switch>
            </Col>
            <Col span="2" offset="1">
              <Button @click="addConfigMapItem" type="primary">添加</Button>
            </Col>
          </Row>
        </FormItem>
        <Editor :content="content" ref="editor"></Editor>
      </Form>
    </Card>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import json2yaml from "json2yaml";
import YAML from 'yamljs';
import commonUtil from "@/commonUtil";

export default {
  name: "ConfigMap",
  components: {
    Editor,
  },
  props: {
    resourceName: String
  },
  data() {
    return {
      temp: {
        data: {
          isSingle: true,
          key: '',
          value: {
            single: '',
            multiline: '',
          }
        }
      },
      configMap: {
        apiVersion: "v1",
        kind: "ConfigMap",
        metadata: {name: this.resourceName, namespace: 'default'},
        data: {}
      },
      content: ''
    }
  },
  methods: {
    checkRequiredFields(){
      return !commonUtil.isArrayEmpty(Object.keys(this.configMap.data));
    },
    constructJSON(){
      // return JSON.stringify(this.configMap);
      let nativeObject  = YAML.parse(this.$refs.editor.mirrorCode);
      return JSON.stringify(nativeObject);
    },
    constructContent() {
      let configMapContent = json2yaml.stringify(this.configMap);
      this.content = configMapContent.replaceAll("\"","");
    },
    addConfigMapItem: function () {
      let namespace = this.configMap.metadata.namespace;
      let key = this.temp.data.key;
      let value = "";
      if(this.temp.data.isSingle){
        value = this.temp.data.value.single;
      }

      //判断命名空间是否为空
      if (commonUtil.isStrEmpty(namespace)) {
        commonUtil.error("命名空间不能为空");
        return;
      }
      //判断 key value是否都为空
      let isStrEmpty = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (isStrEmpty) {
        commonUtil.error("加密数据的key/value不能为空")
        return;
      }

      this.configMap.data[key] = value;
      this.constructContent();
    },

  }
}
</script>

<style scoped>

</style>