<template>
  <Form ref="step2" :model="step2"  :label-width="120" onsubmit="return false;">
    <FormItem label="容器名" prop="container_name">
      <Input v-model="step2.container_name" placeholder="Enter the container name "></Input>
    </FormItem>
    <FormItem label="容器能力">
      <div>
        <Row>
          <Col span="13" style="padding-right:10px">
            <Input v-model="temp.cap_value" placeholder="Enter the container capacity"/>
          </Col>
          <Col span="3" offset="1">
            <Button icon="ios-remove" type="dashed" size="small" @click="addCapValue('cap_drop')">移除能力</Button>
          </Col>
          <Col span="3" offset="2">
            <Button icon="ios-add" type="dashed" size="small" @click="addCapValue('cap_add')">增添能力</Button>
          </Col>
        </Row>
        <div v-show="step2.cap_add.length>0">
          容器增添能力：
          <Tag v-for="item in step2.cap_add" :key="item" :name="item" type="border" color="success" closable @on-close="removeCapAdd">
            {{ item }}
          </Tag>
        </div>
        <div v-show="step2.cap_drop.length>0">
          容器移除能力：
          <Tag v-for="item in step2.cap_drop" :key="item" :name="item" type="border" color="error" closable @on-close="removeCapDrop">
            {{ item }}
          </Tag>
        </div>
      </div>
    </FormItem>
    <FormItem label="启动依赖" v-if="isShowDepend()">
      <Select v-model="step2.depends_on" multiple :max-tag-count="5">
        <Option v-for="item in temp.serviceNameArray" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </FormItem>
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Step2",
  props: {
    serviceName: String,
    serviceNameArray: Array
  },
  mounted() {
    //挂载时,进行数据过滤处理，过滤掉当前serviceName
    let index = this.temp.serviceNameArray.indexOf(this.temp.serviceName);
    this.temp.serviceNameArray.splice(index, 1);
  },
  watch: {
    //进行数据监听，能实时显示其他的启动依赖信息
    serviceName(val) {
      this.temp.serviceName = val;
    },
    serviceNameArray: {
      handler() {
        this.temp.serviceNameArray = commonUtil.deepClone(this.serviceNameArray);
        let index = this.temp.serviceNameArray.indexOf(this.temp.serviceName);
        this.temp.serviceNameArray.splice(index, 1);
      }
    }
  },
  data() {
    return {
      temp: {
        cap_value: '',
        serviceName: this.serviceName,
        serviceNameArray: commonUtil.deepClone(this.serviceNameArray),
        expose: '',
      },
      step2: {
        container_name: '',
        cap_add: [],
        cap_drop: [],
        depends_on: [],
      },
      index: 0,
    }
  },
  methods: {
    //容器能力
    addCapValue(flag) {
      let value = this.temp.cap_value.trim();
      if (commonUtil.isStrEmpty(value)) {
        this.error("添加容器能力失败，内容不能为空");
        return;
      }
      if ("cap_add" === flag) {
        this.step2.cap_add.push(value);
      } else {
        this.step2.cap_drop.push(value);
      }
      this.temp.cap_value = "";
    },
    removeCapAdd(event, name) {
      let index = this.step2.cap_add.indexOf(name);
      this.step2.cap_add.splice(index, 1);
    },
    removeCapDrop(event, name) {
      let index = this.step2.cap_drop.indexOf(name);
      this.step2.cap_drop.splice(index, 1);
    },
    //启动依赖
    isShowDepend() {
      return this.temp.serviceNameArray.length > 0;
    },

  }
}
</script>

<style scoped>

</style>