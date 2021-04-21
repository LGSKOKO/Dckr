<template>
  <div>
    <h3>对象名：{{ secret.metadata.name }}</h3>
    <Card style="background-color: #f5f7f9">
      <Form :label-width="120" :style="{maxWidth:'700px',margin:'0 auto'}" onsubmit="return false;">
        <FormItem label="命名空间">
          <Row>
            <Col span="8" offset="1">
              <Input v-model="secret.metadata.namespace" placeholder="输入指定的命名空间" />
            </Col>
            <Col span="3" offset="1">加密类型</Col>
            <Col span="8">
              <Select v-model="secret.type">
                <Option :value="secret.type" :key="secret.type">{{ secret.type }}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="加密数据">
          <Row>
            <Col span="1">键：</Col>
            <Col span="8">
              <Input v-model="temp.data.key" placeholder="Enter the key"/>
            </Col>
            <Col span="3" offset="1" style="text-align: right">值：</Col>
            <Col span="8" >
              <Input v-model="temp.data.value" placeholder="Enter the value"/>
            </Col>
            <Col span="2" offset="1"><Button @click="addSecretItem" type="primary" >添加</Button></Col>
          </Row>
        </FormItem>
        <Editor :content="content" ref="editor"></Editor>
      </Form>
    </Card>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import json2yaml from 'json2yaml';
import commonUtil from "@/commonUtil";
import YAML from "yamljs";

export default {
  name: "Secret",
  components: {
    Editor,
  },
  props: {
    resourceName: String
  },
  data() {
    return {
      temp: {
        data: {key: '', value: '',}
      },
      secret: {
        apiVersion: "v1",
        kind: "Secret",
        metadata: {name: this.resourceName, namespace: 'default'},
        type: 'Opaque',
        data: {}
      },
      content: ''
    }
  },
  methods: {
    checkRequiredFields(){
      return !commonUtil.isArrayEmpty(Object.keys(this.secret.data));
    },
    constructJSON(){
      // return JSON.stringify(this.secret);
      let nativeObject  = YAML.parse(this.$refs.editor.mirrorCode);
      return JSON.stringify(nativeObject);
    },
    constructContent() {
      let secretContent = json2yaml.stringify(this.secret);
      this.content = secretContent.replaceAll('\"',"");
    },
    addSecretItem: function () {
      let namespace = this.secret.metadata.namespace;
      let key = this.temp.data.key;
      let value = this.temp.data.value;

      //判断命名空间是否为空
      if(commonUtil.isStrEmpty(namespace)){
        commonUtil.error("命名空间不能为空");
        return;
      }
      //判断 key value是否都为空
      let isStrEmpty = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (isStrEmpty) {
        commonUtil.error("加密数据的key/value不能为空")
        return;
      }
      //value 进行Base64编码的加密
      let encoded_str = btoa(encodeURIComponent(value));

      this.secret.data[key] = encoded_str;
      this.constructContent();
    },
  }
}
</script>

<style scoped>

</style>