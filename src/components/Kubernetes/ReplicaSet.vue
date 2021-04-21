<template>
  <div>
    <h3>对象名：{{ resourceName }}</h3>
    <Card style="background-color: #f5f7f9">
      <Steps :current="current" style="cursor:pointer;">
        <Step :title="showStepTip(0)" content="填写对象基础信息" @click.native="jumpToStep(0)"></Step>
        <Step :title="showStepTip(1)" content="填写Pod基础配置" @click.native="jumpToStep(1)"></Step>
        <Step :title="showStepTip(2)" content="填写Pod数据卷配置" @click.native="jumpToStep(2)"></Step>
        <Step :title="showStepTip(3)" content="填写对象其他信息" @click.native="jumpToStep(3)"></Step>
        <Step :title="showStepTip(4)" content="代码构建" @click.native="jumpToStep(4)"></Step>
      </Steps>
      <Button type="primary" style="margin: 5px 0 5px" @click="next(index)">下一步</Button>
      <Button type="primary" @click="integrate" v-show="this.current===4" style="float: right">构 建</Button>
      <Base v-show="isCurrentStep(0)" ref="base" :isShowNamespace="true"
            :style="{maxWidth: '700px',margin: '0 auto' }"></Base>
      <PodTemplate v-show="isCurrentStep(1)" ref="podTemplate"
                   :resourceType="resourceType"
                   :resourceName="resourceName"
                   :style="{maxWidth: '700px',margin: '0 auto' }"></PodTemplate>
      <Volumes v-show="isCurrentStep(2)" ref="volumes"
               :resourceType="resourceType"
               :resourceName="resourceName"
               :style="{maxWidth: '700px',margin: '0 auto' }"></Volumes>
      <OtherTemplate v-show="isCurrentStep(3)" ref="otherTemplate"
                     :style="{maxWidth: '700px',margin: '0 auto' }"></OtherTemplate>
      <Editor v-show="isCurrentStep(4)" :content="content" ref="editor"></Editor>
    </Card>
  </div>
</template>

<script>
import Base from "@/components/Kubernetes/commons/Base";
import PodTemplate from "@/components/Kubernetes/template/PodTemplate";
import OtherTemplate from "@/components/Kubernetes/template/OtherTemplate";
import Volumes from "@/components/Kubernetes/commons/Volumes";
import Editor from "@/components/Editor";
import json2yaml from "json2yaml";
import commonUtil from "@/commonUtil";
import YAML from "yamljs";

export default {
  name: "ReplicaSet",
  components: {
    Base, PodTemplate, OtherTemplate, Volumes, Editor
  },
  props: {
    resourceName: String
  },
  data() {
    return {
      current: 0,
      content: "",
      resourceType:"replicaSet",
      replicaSet: {
        apiVersion: 'apps/v1',
        kind: 'ReplicaSet',
        metadata: {},
        spec: {
          replicas: "",
          selector: {matchLabels: {}},
          template: {
            metadata: {namespace: "", labels: [], annotations: []},
            spec: {
              containers: [],
              imagePullSecret: "",
              restartPolicy: "OnFailure",
              nodeName: "",
              nodeSelector: {},
              volumes: []
            }
          },

        },
      }
    }
  },
  methods: {
    constructJSON() {
      // this.integrateBase();// this.integrateTemplate();// this.integrateOther();// return JSON.stringify(this.replicaSet);
      let nativeObject  = YAML.parse(this.$refs.editor.mirrorCode);
      return JSON.stringify(nativeObject);
    },
    //下面是合并多个组件成ReplicaSet对象方法
    integrate() {
      //检查必填项是否都已经填写
      if (this.checkRequiredFields()) {
        this.integrateBase();
        this.integrateTemplate();
        this.integrateOther();
        this.content = json2yaml.stringify(this.replicaSet).replaceAll("\"", "");
      }
    },
    //检查必填项
    checkRequiredFields() {
      let metadata = this.$refs.base.metadata;

      let flag = commonUtil.isStrEmpty(metadata.namespace) || commonUtil.isArrayEmpty(metadata.labels)
          || this.$refs.podTemplate.checkRequiredFields() || this.$refs.otherTemplate.checkRequiredFields();
      if (flag) {
        this.$Message.error("对象中有尚未填写的必填项!");
        return false;
      }
      return true;
    },
    integrateBase() {
      this.replicaSet.metadata = this.$refs.base.integrateBase();
      this.replicaSet.metadata["name"] = this.resourceName;
    },
    integrateTemplate() {
      let template = this.$refs.podTemplate.integratePodTemplate();
      //此处获取 template下的volumes信息
      template.spec.volumes = this.$refs.volumes.integrateVolumes();
      this.replicaSet.spec.template = template;
    },
    integrateVolumes() {
      this.replicaSet.spec.template.spec["volumes"] = [];
      let volumes = this.$refs.volumes.integrateVolumes();
      if (commonUtil.isArrayEmpty(volumes)) {
        delete this.replicaSet.spec.template.spec.volumes;
      }else{
        this.replicaSet.spec.template.spec.volumes = volumes;
      }
    },
    integrateOther() {
      this.replicaSet.spec.replicas = this.$refs.otherTemplate.replicas;
      this.replicaSet.spec.selector.matchLabels = this.$refs.otherTemplate.integrateOtherTemplate();
    },

    //步骤条相关方法
    next() {
      if (this.current === 4) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    jumpToStep(current) {
      this.current = current;
    },
    showStepTip(current) {
      if (current > this.current) {
        return "未进行";
      } else if (current === this.current) {
        return "进行中";
      } else {
        return "已完成";
      }
    },
    isCurrentStep(current) {
      return this.current === current;
    },

  }
}
</script>

<style scoped>

</style>