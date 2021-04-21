<template>
  <Form :label-width="120" :rules="ruleValidate" :style="{maxWidth:'700px',margin:'0 auto'}" onsubmit="return false;">
    <FormItem label="命名空间" prop="namespace" v-if="isShowNamespace">
      <Row>
        <Col span="18">
          <Input v-model="metadata.namespace" placeholder="输入指定的命名空间"/>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="对象标签" prop="label">
      <Row>
        <Col span="8">
          <Input v-model="temp.label.key" placeholder="Enter the key..."/>
        </Col>
        <Col span="9" offset="1">
          <Input v-model="temp.label.value" placeholder="Enter the value..." @keyup.enter.native="addLabel"/>
        </Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addLabel">添加标签</Button>
        </Col>
      </Row>
      <Row style="margin-top: 5px">
        <Tag v-for="item in temp.labels" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeLabel">
          {{ item }}
        </Tag>
      </Row>
    </FormItem>
    <FormItem label="自定义注释">
      <Row>
        <Col span="8">
          <Input v-model="temp.annotation.key" placeholder="Enter the key..."/>
        </Col>
        <Col span="9" offset="1">
          <Input v-model="temp.annotation.value" placeholder="Enter the value..." @keyup.enter.native="addAnnotation"/>
        </Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addAnnotation">添加注释</Button>
        </Col>
      </Row>
      <Row style="margin-top: 5px">
        <Tag v-for="item in temp.annotations" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeAnnotation">
          {{ item }}
        </Tag>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Base",
  props: {
    isShowNamespace: Boolean,
  },
  data() {
    return {
      temp: {
        label: {key: '', value: ''},
        annotation: {key: '', value: ''},
        labels: [], annotations: []
      },
      metadata: {
        namespace: 'default',
        labels: {},
        annotations: {}
      },
      ruleValidate: {
        namespace: [{required: true}],
        label: [{required: true}],
      }
    }
  },
  methods: {
    integrateBase() {
      let metadata = commonUtil.deepClone(this.metadata);

      if (commonUtil.isArrayEmpty(this.temp.annotations)) {
        delete metadata.annotations;
      }
      return metadata;
    },
    //添加标签
    addLabel() {
      let key = this.temp.label.key.trim();
      let value = this.temp.label.value.trim();
      let flag = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (flag) {
        commonUtil.error("添加标签失败，key/value不能为空");
      } else {
        //构建labels属性
        this.metadata.labels[key] = value;
        //添加提示信息并清空输入框
        let str = key + ":" + value;
        this.temp.labels.push(str);
        this.temp.label.key = "";
        this.temp.label.value = "";
      }

    },
    removeLabel(event, name) {
      //删除metadata的labels
      let key = name.split(":")[0];
      delete this.metadata.labels[key];
      //删除相应提示信息
      let index = this.temp.labels.indexOf(name);
      this.temp.labels.splice(index, 1);
    },
    //添加注释
    addAnnotation() {
      let key = this.temp.annotation.key;
      let value = this.temp.annotation.value;
      let flag = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (flag) {
        commonUtil.error("添加标签失败，key/value不能为空");
      } else {
        let str = key + ":" + value;
        this.temp.annotations.push(str);
        this.metadata.annotations[key] = value;
        //数据置空
        this.temp.annotation.key = "";
        this.temp.annotation.value = "";
      }

    },
    removeAnnotation(event, name) {
      //删除metadata的annotations
      let key = name.split(":")[0];
      delete this.metadata.annotations[key];
      //删除相应提示信息
      let index = this.temp.annotations.indexOf(name);
      this.temp.annotations.splice(index, 1);
    },
  }
}
</script>

<style scoped>

</style>