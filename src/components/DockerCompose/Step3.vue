<template>
  <Form ref="step3" :model="step3"  :label-width="120" onsubmit="return false;">
    <FormItem label="加入网络">
      <Row>
        <Col span="18" style="padding-right:10px">
          <Input v-model="temp.network" placeholder="Enter the network name" @keyup.enter.native="addNetwork"/>
        </Col>
        <Col span="3">
          <Button icon="ios-add" type="dashed" size="small" @click="addNetwork">添加网络</Button>
        </Col>
      </Row>
      <Tag v-for="item in step3.networks" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removeNetwork">
        {{ item }}
      </Tag>
    </FormItem>
    <FormItem label="端口映射">
      <div>
        <Row>
          <Col span="8">
            <Input v-model="temp.port.host" placeholder="Enter the host port"/>
          </Col>
          <Col span="9" offset="1" style="padding-right:10px">
            <Input v-model="temp.port.container" placeholder="Enter the container port" @keyup.enter.native="addPort"/>
          </Col>
          <Col span="3">
            <Button icon="ios-add" type="dashed" size="small" @click="addPort">添加映射</Button>
          </Col>
          <Col span="1" offset="2">
            <i-switch size="large" v-model="temp.isTcp">
              <span slot="open">TCP</span>
              <span slot="close">UDP</span>
            </i-switch>
          </Col>
        </Row>
        <Tag v-for="item in step3.ports" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removePort">
          {{ item }}
        </Tag>
      </div>
    </FormItem>
    <FormItem label="磁盘挂载">
      <div>
        <Row>
          <Col span="8">
            <Input v-model="temp.volume.host" :placeholder="temp.volumeMountTip"/>
          </Col>
          <Col span="9" offset="1" style="padding-right:10px">
            <Input v-model="temp.volume.container" placeholder="Enter the container path"
                   @keyup.enter.native="addVolume"/>
          </Col>
          <Col span="3">
            <Button icon="ios-add" type="dashed" size="small" @click="addVolume">添加挂载</Button>
          </Col>
          <Col span="1" offset="2">
            <i-switch size="large" v-model="temp.isDefault">
              <span slot="open">默认</span>
              <span slot="close">自定义</span>
            </i-switch>
          </Col>
        </Row>
        <Tag v-for="item in step3.volumes" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeVolume">
          {{ item }}
        </Tag>
      </div>
    </FormItem>
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Step3",
  watch: {
    'temp.isDefault': {
      handler() {
        this.temp.volumeMountTip = this.temp.isDefault ? "Enter the host path" : "Enter the volume name";
      }
    }
  },
  data() {
    return {
      temp: {
        network: '',
        port: {host: '', container: ''},
        volume: {host: '', container: ''},
        isTcp: true,
        isDefault: true,
        volumeMountTip: 'Enter the host path'
      },
      step3: {
        ports: [],
        volumes: [],
        volumesType: [],
        networks: []
      },
      index: 0,
    }
  },
  methods: {
    //Network相关方法：加入网络、移除网络
    addNetwork() {
      let value = this.temp.network.trim();
      if (commonUtil.isStrEmpty(value)) {
        this.error("添加网络失败，内容不能为空");
        return;
      }
      this.step3.networks.push(value);
      this.temp.network = "";
    },
    removeNetwork(event, name) {
      let index = this.step3.networks.indexOf(name);
      this.step3.networks.splice(index, 1);
    },
    //端口映射相关方法：添加端口映射、移除端口映射
    addPort() {
      let host = this.temp.port.host.trim();
      let container = this.temp.port.container.trim();
      if (commonUtil.isStrEmpty(host) || commonUtil.isStrEmpty(container)) {
        this.error("添加端口映射失败，内容不能为空");
      } else {
        let str = "\'" + host + ":" + container;
        if (!this.temp.isTcp) {
          str += "/udp";
        }
        str += "\'";
        this.step3.ports.push(str);
        //数据置空
        this.temp.port.host = "";
        this.temp.port.container = "";
      }
    },
    removePort(event, name) {
      let index = this.step3.ports.indexOf(name);
      this.step3.ports.splice(index, 1);
    },
    //磁盘挂载相关方法：添加磁盘挂载、移除磁盘挂载
    addVolume() {
      let host = this.temp.volume.host.trim();
      let container = this.temp.volume.container.trim();
      if (commonUtil.isStrEmpty(host) || commonUtil.isStrEmpty(container)) {
        this.error("添加磁盘挂载失败，内容不能为空");
      } else {
        let str = host + ":" + container;

        this.step3.volumesType.push(this.temp.isDefault);
        this.step3.volumes.push(str);
        //数据置空
        this.temp.volume.host = "";
        this.temp.volume.container = "";
      }
    },
    removeVolume(event, name) {
      let index = this.step3.volumes.indexOf(name);
      this.step3.volumes.splice(index, 1);

      this.step3.volumesType.splice(index, 1);
    },


  }
}
</script>

<style scoped>

</style>