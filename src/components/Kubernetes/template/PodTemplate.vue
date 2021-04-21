<template>
  <div>
    <Divider>metadata</Divider>
    <Base ref="base" :style="{maxWidth: '700px',margin: '0 auto' }" :isShowNamespace="false"></Base>
    <Divider>container</Divider>
    <Container ref="container" :resourceType="resourceType" :resourceName="resourceName" :style="{maxWidth: '700px',margin: '0 auto' }"></Container>
  </div>

</template>

<script>
import Base from "@/components/Kubernetes/commons/Base";
import Container from "@/components/Kubernetes/commons/Container";
import commonUtil from "@/commonUtil";

export default {
  name: "PodTemplate",
  components: {
    Base, Container
  },
  props: {
    resourceType: String,
    resourceName: String
  },
  data() {
    return {
      template: {
        metadata: {namespace: "", labels: [], annotations: []},
        spec: {containers: [], volumes: []}
      }
    }
  },
  methods: {
    //检查必填项
    checkRequiredFields() {
      let metadata = this.$refs.base.metadata;
      let container = this.$refs.container.container;

      let flag = commonUtil.isArrayEmpty(metadata.labels) || commonUtil.isStrEmpty(container.name) || commonUtil.isStrEmpty(container.image);
      return flag;
    },
    integratePodTemplate() {
      this.integrateBase();
      this.integrateContainer();
      return commonUtil.deepClone(this.template);
    },
    integrateBase() {
      this.template.metadata = this.$refs.base.integrateBase();
      delete this.template.metadata.namespace;
    },
    integrateContainer() {
      //push前先清空数组
      let container = this.$refs.container.integrateContainer();
      this.template.spec.containers = [];
      this.template.spec.containers.push(container);
    },
  }
}
</script>

<style scoped>
.paddingRightUnit {
  padding-right: 10px;
}
</style>