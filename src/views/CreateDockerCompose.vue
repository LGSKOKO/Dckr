<template>
  <div class="wrapper-content ivu-article" style="margin-top: -15px">
    <h1>Docker-Compose</h1>
    <!--Step1,填写服务名称              -->
    <div>
      <h2 id="service_name">
        <Badge :count="1" type="info"></Badge>
        填写服务名称
      </h2>
      <p>此步骤进行服务名称的填写，服务名称与服务相对应。</p>
      <Card style="background-color: #f5f7f9">
        <div :style="{width:'600px',margin:'0 auto'}">
          <Form ref="formInline" :label-width="160" inline onsubmit="return false;">
            <FormItem label="服务名称">
              <Row>
                <Col span="20" style="padding-right:10px">
                  <Input v-model="serviceName" placeholder="Enter the service name" @keyup.enter.native="addService"/>
                </Col>
                <Col span="3" offset="1">
                  <Button icon="ios-add" type="dashed" size="small" @click="addService">添加服务</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <Tag v-for="item in serviceNameArray" :key="item" :name="item"
               type="dot" color="primary" closable @on-close="removeService">
            {{ item }}
          </Tag>
        </div>
      </Card>
    </div>
    <!--Step2,具体信息的填写              -->
    <div>
      <h2 id="service_info">
        <Badge :count="2" type="info"></Badge>
        填写服务具体信息
      </h2>
      <p>此步骤进行具体信息的填写，是服务的重要构成要素。</p>
      <div v-for="(item,index) in serviceNameArray" style="margin-top: 15px;">
        <h3>服务名：<span style="font-weight: bold">{{ item }}</span></h3>
        <Card style="background-color: #f5f7f9">
          <Steps :current="serviceStepArray[index]" style="cursor:pointer">
            <Step :title="showStepTip(index,0)" content="填写服务基础信息" @click.native="jumpToStep(index,0)"></Step>
            <Step :title="showStepTip(index,1)" content="填写服务高级配置" @click.native="jumpToStep(index,1)"></Step>
            <Step :title="showStepTip(index,2)" content="填写服务交互配置" @click.native="jumpToStep(index,2)"></Step>
            <Step :title="showStepTip(index,3)" content="填写服务部署信息" @click.native="jumpToStep(index,3)"></Step>
          </Steps>
          <Button type="primary" style="margin: 5px 0 5px" @click="next(index)">下一步</Button>
          <Step1 v-show="isCurrentStep(index,0)" ref="step1"
                 :style="{maxWidth: '650px',margin: '0 auto' }"></Step1>
          <Step2 v-show="isCurrentStep(index,1)" ref="step2"
                 :serviceName="item"
                 :serviceNameArray="serviceNameArray"
                 :style="{maxWidth: '650px',margin: '0 auto' }"></Step2>
          <Step3 v-show="isCurrentStep(index,2)" ref="step3"
                 :style="{maxWidth: '650px',margin: '0 auto' }"></Step3>
          <Step4 v-show="isCurrentStep(index,3)" ref="step4"
                 :style="{maxWidth: '650px',margin: '0 auto' }"></Step4>

        </Card>
      </div>
    </div>
    <!--Step3,构建YAML              -->
    <div>
      <h2 id="create_yaml">
        <Badge :count="3" type="info"></Badge>
        构建YAML
      </h2>
      <p>此步骤根据服务的具体信息，构建YAML。
        <Button type="primary" @click="createDockerCompose()">构 建</Button>
      </p>
      <Editor :content="DockerComposeContent"></Editor>
    </div>
  </div>
</template>

<script>
//import common components
import Editor from '../components/Editor.vue';
//import self components
import Step1 from "@/components/DockerCompose/Step1";
import Step2 from "@/components/DockerCompose/Step2";
import Step3 from "@/components/DockerCompose/Step3";
import Step4 from "@/components/DockerCompose/Step4";

import json2yaml from 'json2yaml';
import commonUtil from "@/commonUtil";


export default {
  name: "CreateDockerCompose",
  components: {
    Editor,
    Step1, Step2, Step3, Step4
  },
  data() {
    return {
      serviceName: '',
      serviceNameArray: [],
      serviceStepArray: [],
      networkArray: [],
      volumeArray: [],
      DockerCompose: {version: '\'3.0\'', services: {}, networks: {}, volumes: {}},
      DockerComposeContent: '',
    }
  },
  methods: {
    //步骤条相关方法：展示步骤条提示信息，下一步，跳转特定步骤，
    showStepTip(index, current) {
      if (current > this.serviceStepArray[index]) {
        return "未进行";
      } else if (current === this.serviceStepArray[index]) {
        return "进行中";
      } else {
        return "已完成";
      }
    },
    next(index) {
      if (this.serviceStepArray[index] === 3) {
        this.serviceStepArray.splice(index, 1, 0);
      } else {
        let newValue = this.serviceStepArray[index] + 1;
        this.serviceStepArray.splice(index, 1, newValue);
      }
    },
    jumpToStep(index, current) {
      this.serviceStepArray.splice(index, 1, current);
    },
    isCurrentStep(index, value) {
      return this.serviceStepArray[index] === value;
    },
    //添加、删除服务方法
    addService() {
      let serviceName = this.serviceName.trim();
      if (commonUtil.isStrEmpty(serviceName)) {
        commonUtil.error("添加服务失败，内容不能为空");
      } else {
        this.serviceNameArray.push(serviceName);
        //DockerCompose.services添加属性
        this.DockerCompose.services[serviceName] = {};
        //服务名进行置空处理。
        this.serviceName = "";
        //该服务步骤条初始化为0,即第一步
        this.serviceStepArray.push(0);
      }
    },
    removeService(event, name) {
      //删除相关属性
      delete this.DockerCompose.services[name];
      //删除相关显示信息
      const index = this.serviceNameArray.indexOf(name);
      this.serviceNameArray.splice(index, 1);
      this.serviceStepArray.splice(index, 1);
    },
    //构建docker-compose.yaml
    createDockerCompose() {
      //检查必填项是否都已填写
      let flag = this.checkRequiredFields();
      if (flag) {
        this.integrateService();
      }
    },
    checkRequiredFields() {
      //先判断服务个数是否小于等于0，若是则不通过并进行提示。
      if ( commonUtil.isArrayEmpty(this.serviceNameArray) ) {
        this.$Message.error("服务个数不能为0！");
        return false;
      }
      //遍历所有服务的数据，查看是否有 未填写的必填项
      for (let index = 0; index < this.serviceNameArray.length; index++) {
        //获取当前服务（eachService）的image和build信息
        let image = this.$refs.step1[index].step1.image;
        let build = this.$refs.step1[index].step1.build;
        //判断是否image或build信息都没填写，若是则不通过进行提示
        let flag = commonUtil.isStrEmpty(image);
        flag &= (commonUtil.isStrEmpty(build.context) || commonUtil.isStrEmpty(build.dockerfile));
        if (flag) {
          this.$Message.error("服务中有尚未填写的必填项！");
          return false;
        }
      }

      return true;
    },
    integrateService() {
      //原始数据清空
      this.networkArray = [];
      this.volumeArray = [];
      //遍历所有服务,并组合每个服务的每个步骤
      for (let index = 0; index < this.serviceNameArray.length; index++) {
        //获取当前服务(eachService)的每个步骤具体信息
        let step1 = this.$refs.step1[index].step1;
        let step2 = this.$refs.step2[index].step2;
        let step3 = this.$refs.step3[index].step3;
        let step4 = this.$refs.step4[index].step4;

        //先获取服务名，通过服务名获取服务，传递服务引用至方法中进行组合
        let serviceName = this.serviceNameArray[index].trim();
        let service = this.DockerCompose.services[serviceName];
        this.integrateStep1(service, step1);
        this.integrateStep2(service, step2);
        this.integrateStep3(service, step3);
        this.integrateStep4(service, step4);
      }

      //遍历networkArray，构造DockerCompose.networks
      this.DockerCompose['networks'] = {};
      if (commonUtil.isArrayEmpty(this.networkArray)) {
        delete this.DockerCompose.networks;
      }
      for (let index = 0; index < this.networkArray.length; index++) {
        let item = this.networkArray[index];
        this.DockerCompose.networks[item] = {};
      }

      //遍历volumeArray，构造DockerCompose.volumes
      this.DockerCompose['volumes'] = {};
      if (commonUtil.isArrayEmpty(this.volumeArray)) {
        delete this.DockerCompose.volumes;
      }
      for (let index = 0; index < this.volumeArray.length; index++) {
        let item = this.volumeArray[index];
        this.DockerCompose.volumes[item] = {};
      }

      this.DockerComposeContent = json2yaml.stringify(this.DockerCompose).replaceAll("{}", "")
          .replaceAll("\"", "");

    },
    integrateStep1(service, step1) {
      if (!commonUtil.isStrEmpty(step1.image)) {
        service.image = step1.image;
      } else {
        service.build = step1.build;
      }

      if (!commonUtil.isArrayEmpty(step1.env_file)) {
        service.env_file = step1.env_file;
      }
      if (!commonUtil.isArrayEmpty(step1.environment)) {
        service.environment = step1.environment;
      }
      if (!commonUtil.isArrayEmpty(step1.expose)) {
        service.expose = step1.expose;
      }
      if (!commonUtil.isStrEmpty(step1.entrypoint)) {
        service.entrypoint = step1.entrypoint;
      }
    },
    integrateStep2(service, step2) {
      if (!commonUtil.isStrEmpty(step2.container_name)) {
        service.container_name = step2.container_name;
      }
      if (!commonUtil.isArrayEmpty(step2.cap_add)) {
        service.cap_add = step2.cap_add;
      }
      if (!commonUtil.isArrayEmpty(step2.cap_drop)) {
        service.cap_drop = step2.cap_drop;
      }
      if (!commonUtil.isArrayEmpty(step2.depends_on)) {
        service.depends_on = step2.depends_on;
      }
    },
    integrateStep3(service, step3) {
      //ports
      service["ports"] = [];
      if (!commonUtil.isArrayEmpty(step3.ports)) {
        service.ports = step3.ports;
      } else {
        delete service.ports;
      }

      //volumeArray
      service["volumes"] = [];
      if (!commonUtil.isArrayEmpty(step3.volumes)) {
        service.volumes = step3.volumes;
        //构造不重复的volumeArray
        for (let index = 0; index < step3.volumes.length; index++) {
          let item = step3.volumes[index].split(":")[0];
          //step3.volumesType[index]的值是isDefault，这里进行取反
          let flag = !step3.volumesType[index];
          if (flag && -1 === this.volumeArray.indexOf(item)) {
            this.volumeArray.push(item);
          }
        }
      } else {
        delete service.volumes;
      }

      //networkArray
      service["networks"] = [];
      if (!commonUtil.isArrayEmpty(step3.networks)) {
        service.networks = step3.networks;

        //构造不重复的networkArray
        for (let index = 0; index < step3.networks.length; index++) {
          let item = step3.networks[index];
          if (-1 === this.networkArray.indexOf(item)) {
            this.networkArray.push(item);
          }
        }
      } else {
        delete service.networks;
      }
    },
    integrateStep4(service, step4) {
      let flag = true;
      service.deploy = {
        replicas: '',
        resources: {limits: {}},
        update_config: {},
        restart_policy: {},
      };
      //replicas 数据过滤
      if (!commonUtil.isStrEmpty(step4.deploy.replicas)) {
        service.deploy.replicas = step4.deploy.replicas;
        flag = false;
      } else {
        delete service.deploy.replicas;
      }

      //resource 数据过滤
      let resource = step4.deploy.resources;
      let cpus = !commonUtil.isStrEmpty(resource.limits.cpus);
      let memory = !commonUtil.isStrEmpty(resource.limits.memory);
      if (cpus || memory) {
        if (cpus) {
          service.deploy.resources.limits.cpus = resource.limits.cpus;
        }
        if (memory) {
          service.deploy.resources.limits.memory = resource.limits.memory;
        }
        flag = false;
      } else {
        delete service.deploy.resources;
      }

      //update_config 数据过滤
      let update_config = step4.deploy.update_config;
      let parallelism = !commonUtil.isStrEmpty(update_config.parallelism);
      let delay_uc = !commonUtil.isStrEmpty(update_config.delay);
      let order = !commonUtil.isStrEmpty(update_config.order);
      let failure_action = !commonUtil.isStrEmpty(update_config.failure_action);
      if (parallelism || delay_uc || order || failure_action) {
        if (parallelism) {
          service.deploy.update_config.parallelism = update_config.parallelism;
        }
        if (delay_uc) {
          service.deploy.update_config.delay = update_config.delay;
        }
        if (order) {
          service.deploy.update_config.order = update_config.order;
        }
        if (failure_action) {
          service.deploy.update_config.failure_action = update_config.failure_action;
        }
        flag = false;
      } else {
        delete service.deploy.update_config;
      }

      //restart_policy 数据过滤
      let restart_policy = step4.deploy.restart_policy;
      let condition = !commonUtil.isStrEmpty(restart_policy.condition);
      let delay_rp = !commonUtil.isStrEmpty(restart_policy.delay);
      let window = !commonUtil.isStrEmpty(restart_policy.window);
      let max_attempts = !commonUtil.isStrEmpty(restart_policy.max_attempts);
      if (condition || delay_rp || window || max_attempts) {
        if (condition) {
          service.deploy.restart_policy.condition = restart_policy.condition;
        }
        if (delay_rp) {
          service.deploy.restart_policy.delay = restart_policy.delay;
        }
        if (window) {
          service.deploy.restart_policy.window = restart_policy.window;
        }
        if (max_attempts) {
          service.deploy.restart_policy.max_attempts = restart_policy.max_attempts;
        }
        flag = false;
      } else {
        delete service.deploy.restart_policy;
      }

      if (flag) {
        delete service.deploy;
      }

    },
  }
}
</script>

<style scoped>
.ivu-article h1 {
  font-size: 26px;
  font-weight: 400;
}

.wrapper-content h1 {
  margin: 12px 0;
}

.wrapper-content h2 {
  margin: 12px 0;
}
</style>