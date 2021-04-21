<template>
  <Form :label-width="160" onsubmit="return false;">
    <FormItem label="重启规则">
      <Row>
        <Col span="18">
          <Select v-model="restartPolicy">
            <Option value="OnFailure" key="OnFailure">OnFailure</Option>
            <Option value="Always" key="Always">Always</Option>
            <Option value="Never" key="Never">Never</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="私有镜像拉取">
      <Row>
        <Col span="18"><Input v-model="imagePullSecret" placeholder="输入imagePullSecret信息"/></Col>
      </Row>
    </FormItem>
    <FormItem label="NodeName">
      <Row>
        <Col span="18"><Input v-model="nodeName" placeholder="输入指定节点的名称"/></Col>
      </Row>
    </FormItem>
    <FormItem label="NodeSelector">
      <Row>
        <Col span="8"><Input v-model="node.key" placeholder="输入节点标签的key"/></Col>
        <Col span="9" offset="1"><Input v-model="node.value" placeholder="输入节点标签的value"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addNodeSelector">添加节点</Button>
        </Col>
      </Row>
      <Tag v-for="item in nodeSelectorTip" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removeNodeSelector">
        {{ item }}
      </Tag>
    </FormItem>
  </Form>
</template>

<script>

import commonUtil from "@/commonUtil";

export default {
  name: "Other",
  data() {
    return {
      node: {key: "", value:""},
      imagePullSecret: "",
      restartPolicy: "OnFailure",
      nodeName: "",
      nodeSelector: [],
      nodeSelectorTip: [],
    }
  },
  methods: {
    addNodeSelector() {
      let key = this.node.key.trim();
      let value = this.node.value.trim();
      let flag = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);

      if (flag) {
        commonUtil.error("添加节点失败，内容不能为空");
      } else {
        //构建对象，并进行添加
        let obj = {};
        obj[key] = value;
        this.nodeSelector.push(obj);
        //添加提示信息
        let str = key + ":" + value;
        this.nodeSelectorTip.push(str);
        //清空输入框
        this.node.key = "";
        this.node.value = "";
      }
    },
    removeNodeSelector(event, name) {
      let index = this.nodeSelectorTip.indexOf(name);
      this.nodeSelectorTip.splice(index,1);
      this.nodeSelector.splice(index,1);
    },
  }
}
</script>

<style scoped>

</style>