<template>
  <div>
    <h3>对象名：{{ resourceName }}</h3>
    <Card style="background-color: #f5f7f9">
      <Form :label-width="120" :style="{maxWidth:'700px',margin:'0 auto'}" onsubmit="return false;">
        <FormItem label="匹配标签" prop="matchLabels">
          <Row>
            <Col span="8">
              <Input v-model="temp.matchLabel.key" placeholder="输入相应资源对象标签的key"/>
            </Col>
            <Col span="9" offset="1">
              <Input v-model="temp.matchLabel.value" placeholder="输入相应资源对象标签的Value" @keyup.enter.native="addLabel"/>
            </Col>
            <Col span="2" offset="1">
              <Button icon="ios-add" type="dashed" size="small" @click="addLabel">匹配标签</Button>
            </Col>
          </Row>
          <Row style="margin-top: 5px">
            <Tag v-for="item in temp.matchLabels" :key="item" :name="item" type="border" color="primary" closable
                 @on-close="removeLabel">
              {{ item }}
            </Tag>
          </Row>
        </FormItem>
        <FormItem label="网络类型">
          <Row>
            <Col span="18">
              <Select v-model="service.spec.type">
                <Option value="ClusterIP">ClusterIP</Option>
                <Option value="NodePort">NodePort</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="端口映射">
          <div>
            <Row>
              <Col span="5">
                <Input v-model="temp.port.port" placeholder="输入开放端口"/>
              </Col>
              <Col span="7" style="margin-left: 10px;">
                <Input v-model="temp.port.targetPort" placeholder="输入资源对象的容器端口"/>
              </Col>
              <Col span="5" style="margin-left: 10px;" class="paddingRightUnit"
                   v-show="service.spec.type === 'NodePort'">
                <Input v-model="temp.port.nodePort" placeholder="输入结点端口" @keyup.enter.native="addPort"/>
              </Col>
              <Col span="2" style="margin-left: 10px;">
                <Button icon="ios-add" type="dashed" size="small" @click="addPort">端口映射</Button>
              </Col>
              <Col span="1" offset="2">
                <i-switch size="large" v-model="temp.isTcp">
                  <span slot="open">TCP</span>
                  <span slot="close">UDP</span>
                </i-switch>
              </Col>
            </Row>
            <Tag v-for="item in temp.ports" :key="item" :name="item" type="border" color="primary" closable
                 @on-close="removePort">
              {{ item }}
            </Tag>
          </div>
        </FormItem>
        <Editor :content="content" ref="editor"></Editor>
      </Form>
    </Card>
  </div>
</template>

<script>
import commonUtil from "@/commonUtil";
import Editor from "@/components/Editor";
import json2yaml from 'json2yaml';
import YAML from "yamljs";


export default {
  name: "Service",
  props: {
    resourceName: String
  },
  components: {
    Editor
  },
  data() {
    return {
      temp: {
        //端口映射信息
        isTcp: true,
        matchLabel: {key: '', value: ''},
        port: {protocol: '', targetPort: '', port: '', nodePort: ''},
        ports: [], matchLabels: []
      },
      service: {
        apiVersion: "v1",
        kind: "Service",
        metadata: {name: this.resourceName},
        spec: {type: "ClusterIP", selector: {}, ports: []}
      },
      ruleValidate: {
        matchLabels: [{required: true}],
      },
      content: ""
    }
  },
  methods: {
    checkRequiredFields() {
      return !commonUtil.isArrayEmpty(this.temp.matchLabels);
    },
    integrateOtherTemplate() {
      return commonUtil.deepClone(this.matchLabels);
    },
    constructJSON(){
      // return JSON.stringify(this.service);
      let nativeObject  = YAML.parse(this.$refs.editor.mirrorCode);
      return JSON.stringify(nativeObject);
    },
    constructContent() {
      let flag = this.checkRequiredFields();
      if (flag){
        let service = commonUtil.deepClone(this.service);
        this.content = json2yaml.stringify(service).replaceAll("\"","");
      }else{
        commonUtil.error("尚未匹配标签！！！");
      }
    },
    //添加匹配标签
    addLabel() {
      let key = this.temp.matchLabel.key.trim();
      let value = this.temp.matchLabel.value.trim();

      let flag = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (flag) {
        commonUtil.error("匹配标签失败，key/value不能为空");
      } else {
        //为selector添加属性
        this.service.spec.selector[key] = value;
        //添加提示信息
        let str = key + ":" + value;
        this.temp.matchLabels.push(str);
        //清空输入框
        this.temp.matchLabel.key = "";
        this.temp.matchLabel.value = "";
      }
    },
    removeLabel(event, name) {
      //移除selector相应属性
      let key = name.split(":")[0];
      delete this.service.spec.selector[key];
      //删除labels
      let index = this.temp.matchLabels.indexOf(name);
      this.temp.matchLabels.splice(index, 1);
    },
    //端口映射
    addPort() {
      let port = this.temp.port.port.trim();
      let targetPort = this.temp.port.targetPort.trim();
      let flag = commonUtil.isStrEmpty(port) || commonUtil.isStrEmpty(targetPort);
      if (flag) {
        commonUtil.error("端口映射失败，端口内容不能为空");
      } else {
        //构建对象并进行存储
        let obj = {};
        obj["port"] = port;
        obj["targetPort"] = targetPort;
        //进行nodePort的判空处理
        let type = this.service.spec.type;
        let nodePort = this.temp.port.nodePort;
        if ("NodePort" === type && !commonUtil.isStrEmpty(nodePort)) {
          obj["nodePort"] = nodePort;
        }

        let str = port + ":" + targetPort;
        if (this.temp.isTcp) {
          str += "/tcp";
          obj["protocol"] = "TCP";
        } else {
          str += "/udp";
          obj["protocol"] = "UDP";
        }
        this.service.spec.ports.push(obj);
        //添加相应标签信息
        this.temp.ports.push(str);
        this.temp.port.port = "";
        this.temp.port.targetPort = "";
        this.temp.port.nodePort = "";

        this.constructContent();
      }
    },
    removePort(event, name) {
      let index = this.temp.ports.indexOf(name);
      this.temp.ports.splice(index, 1);
      this.service.spec.ports.splice(index, 1);

      this.constructContent();
    },

  }
}
</script>

<style scoped>

</style>