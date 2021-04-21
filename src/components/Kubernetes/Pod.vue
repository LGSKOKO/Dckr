<template>
  <div>
    <h3>对象名：{{ resourceName }}</h3>
    <Card style="background-color: #f5f7f9">
      <Steps :current="current" style="cursor:pointer;">
        <Step :title="showStepTip(0)" content="填写对象基础信息" @click.native="jumpToStep(0)"></Step>
        <Step :title="showStepTip(1)" content="填写容器相关配置" @click.native="jumpToStep(1)"></Step>
        <Step :title="showStepTip(2)" content="填写对象数据卷配置" @click.native="jumpToStep(2)"></Step>
        <Step :title="showStepTip(3)" content="填写对象其他信息" @click.native="jumpToStep(3)"></Step>
        <Step :title="showStepTip(4)" content="代码构建" @click.native="jumpToStep(4)"></Step>
      </Steps>
      <Button type="primary" style="margin: 5px 0 5px" @click="next(index)">下一步</Button>
      <Button type="primary" @click="integrate" v-show="this.current===4" style="float: right">构 建</Button>
      <Base v-show="isCurrentStep(0)" ref="base" :isShowNamespace="true"
            :style="{maxWidth: '700px',margin: '0 auto' }"></Base>
      <Container v-show="isCurrentStep(1)" ref="container"
                 :resourceType="resourceType"
                 :resourceName="resourceName"
                 :style="{maxWidth: '700px',margin: '0 auto' }"></Container>
      <Volumes v-show="isCurrentStep(2)" ref="volumes"
               :resourceType="resourceType"
               :resourceName="resourceName"
               :style="{maxWidth: '700px',margin: '0 auto' }"></Volumes>
      <Other v-show="isCurrentStep(3)" ref="other"
             :style="{maxWidth: '700px',margin: '0 auto' }"></Other>
      <Editor v-show="isCurrentStep(4)" :content="content" ref="editor"></Editor>
    </Card>
  </div>
</template>

<script>
import Base from "@/components/Kubernetes/commons/Base";
import Container from "@/components/Kubernetes/commons/Container";
import Other from "@/components/Kubernetes/commons/Other";
import Volumes from "@/components/Kubernetes/commons/Volumes";
import Editor from "@/components/Editor";
import json2yaml from "json2yaml";
import commonUtil from "@/commonUtil";
import YAML from "yamljs";

export default {
  name: "Pod",
  components: {
    Base, Container, Other, Volumes, Editor
  },
  props: {
    resourceName: String
  },
  data() {
    return {
      current: 0,
      content: "",
      resourceType:"pod",
      pod: {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {},
        spec: {
          containers: [],
          imagePullSecret: "",
          restartPolicy: "OnFailure",
          nodeName: "",
          nodeSelector: {},
          volumes: []
        },
      }
    }
  },
  methods: {
    constructJSON() {
      // this.integrateBase();// this.integrateContainer();// this.integrateVolumes();// this.integrateOther();
      let nativeObject  = YAML.parse(this.$refs.editor.mirrorCode);
      return JSON.stringify(nativeObject);
    },
    //下面是合并多个组件成Pod对象方法
    integrate() {
      //检查必填项是否都已经填写
      if (this.checkRequiredFields()) {
        this.integrateBase();
        this.integrateContainer();
        this.integrateVolumes();
        this.integrateOther();
        this.content = json2yaml.stringify(this.pod).replaceAll("\"", "");
      }
    },
    //检查必填项
    checkRequiredFields() {
      let metadata = this.$refs.base.metadata;
      let container = this.$refs.container.container;

      let flag = commonUtil.isStrEmpty(metadata.namespace) || commonUtil.isArrayEmpty(metadata.labels)
          || commonUtil.isStrEmpty(container.name) || commonUtil.isStrEmpty(container.image);
      if (flag) {
        this.$Message.error("Pod对象中有尚未填写的必填项!");
        return false;
      }
      return true;
    },
    integrateBase() {
      this.pod.metadata = this.$refs.base.integrateBase();
      this.pod.metadata["name"] = this.resourceName;
    },
    integrateContainer() {
      //push前先清空数组
      let container = this.$refs.container.integrateContainer();
      this.pod.spec.containers = [];
      this.pod.spec.containers.push(container);
    },
    integrateVolumes() {
      this.pod.spec["volumes"] = [];
      let volumes = this.$refs.volumes.integrateVolumes();
      if (commonUtil.isArrayEmpty(volumes)) {
        delete this.pod.spec.volumes;
      }else{
        this.pod.spec.volumes = volumes;
      }
    },
    integrateOther() {

      let imagePullSecret = this.$refs.other.imagePullSecret;
      let nodeName = this.$refs.other.nodeName;
      let nodeSelector = commonUtil.deepClone(this.$refs.other.nodeSelector);

      if (commonUtil.isStrEmpty(imagePullSecret)) {
        delete this.pod.spec.imagePullSecret;
      } else {
        this.pod.spec.imagePullSecret = imagePullSecret;
      }

      if (commonUtil.isStrEmpty(nodeName)) {
        delete this.pod.spec.nodeName;
      } else {
        this.pod.spec.nodeName = nodeName;
      }

      if (commonUtil.isArrayEmpty(nodeSelector)) {
        delete this.pod.spec.nodeSelector
      } else {
        this.pod.spec.nodeSelector = nodeSelector;
      }

      this.pod.spec.restartPolicy = this.$refs.other.restartPolicy;
    },
    //下一步
    next() {
      if (this.current === 4) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    //步骤条提示信息
    showStepTip(current) {
      if (current > this.current) {
        return "未进行";
      } else if (current === this.current) {
        return "进行中";
      } else {
        return "已完成";
      }
    },
    jumpToStep(current) {
      this.current = current;
    },
    isCurrentStep(current) {
      return this.current === current;
    },
  }
}
</script>

<style scoped>

</style>