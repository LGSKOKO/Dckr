<template>
  <Form ref="step4" :model="step4" :label-width="100" onsubmit="return false;">

    <FormItem label="将端口">
      <Row>
        <Col span="11" style="padding-right:10px">
          <Input v-model="temp.expose" placeholder="Enter the expose port" @keyup.enter.native="addPort" />
        </Col>
        <Col>作为容器的开放端口</Col>
        <Col span="3" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addPort">添加端口</Button>
        </Col>
        <Col span="1" offset="2">
          <i-switch size="large" v-model="temp.isTcp">
            <span slot="open">TCP</span>
            <span slot="close">UDP</span>
          </i-switch>
        </Col>
      </Row>
      <Tag v-for="item in step4.exposes" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removePort">
        {{ item }}
      </Tag>
    </FormItem>

    <FormItem label="将路径">
      <Row>
        <Col span="11" style="padding-right:10px">
          <Input v-model="temp.volume" placeholder="Enter the path" @keyup.enter.native="addVolume"/>
        </Col>
        <Col>作为容器的持久存储</Col>
        <Col span="3" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addVolume">持久存储</Button>
        </Col>
      </Row>
      <Tag v-for="item in step4.volumes" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removeVolume">
        {{ item }}
      </Tag>
    </FormItem>
    <FormItem label="启动脚本/命令" >
      <Row>
        <Col span="21">
          <Input v-model="step4.entryPoint" placeholder="Enter the ENTRYPOINT" />
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Step4",
  data() {
    return {
      temp: {
        expose: '',
        volume: '',
        isTcp: true,
      },
      step4: {
        commandType: '端口开放',
        exposes: [],
        volumes: [],
        entryPoint: '',
        items: [],
      },
      index: 0,
    }
  },
  methods: {
    addPort() {
      if (this.temp.expose.trim() === '') {
        commonUtil.error("添加端口失败，内容不能为空");
      } else {
        let str = this.temp.expose.trim();
        str = this.temp.isTcp ? str+"/tcp" : str+"/udp";
        this.step4.exposes.push(str);
        this.temp.expose = "";
      }
    },
    removePort(event, name) {
      let index = this.step4.exposes.indexOf(name);
      this.step4.exposes.splice(index, 1);
    },
    addVolume(){
      if (this.temp.volume.trim() === '') {
        commonUtil.error("添加持久存储失败，内容不能为空");
      } else {
        let str = this.temp.volume.trim();
        this.step4.volumes.push(str);
        this.temp.volume = "";
      }
    },
    removeVolume(event, name) {
      let index = this.step4.volumes.indexOf(name);
      this.step4.volumes.splice(index, 1);
    },
  }
}
</script>

<style scoped>

</style>