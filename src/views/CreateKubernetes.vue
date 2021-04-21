<template>
  <div class="wrapper-content ivu-article" style="margin-top: -15px">
    <h1>Kubernetes</h1>
    <!--Step1,选择构建方式              -->
    <div>
      <h2 id="build_way">
        <Badge :count="1" type="info"></Badge>
        选择构建方式
      </h2>
      <p>此步骤进行构建方式的选择，构建方式的不同所填信息也不同。</p>
      <Card style="background-color: #f5f7f9">
        <div :style="{maxWidth:'650px',margin:'0 auto'}">
          <Form :label-width="160" inline onsubmit="return false;">
            <FormItem label="构建方式">
              <RadioGroup v-model="temp.construction">
                <Radio label="向导式构建" border></Radio>
                <Radio label="Docker-Compose" border></Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <!--Docker-Compose构建              -->
    <div v-show="isCurrentConstruction('Docker-Compose')">
      <!--Step2,目标对象选择及文件上传  -->
      <div>
        <h2>
          <Badge :count="2" type="info"></Badge>
          目标信息填写
        </h2>
        <p>此步骤进行信息填写及文件上传，所填信息不同其目标对象也不同。</p>
        <Card style="background-color: #f5f7f9">
          <div :style="{maxWidth: '650px',margin:'0 auto'}">
            <Form ref="upload" :label-width="160" inline>
              <FormItem label="文件格式">
                <RadioGroup v-model="upload.format">
                  <Radio label="YAML" border></Radio>
                  <Radio label="JSON" border></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="组织形式">
                <RadioGroup v-model="upload.organization">
                  <Radio label="HELM" border></Radio>
                  <Radio label="DEFAULT" border></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="目标对象">
                <RadioGroup v-model="upload.target">
                  <Radio label="DaemonSet" border></Radio>
                  <Radio label="ReplicaSet" border></Radio>
                  <Radio label="Deployment" border></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="文件上传">
                <Upload
                    multiple
                    type="drag"
                    action=""
                    style="width: 400px"
                    :before-upload="beforeUpload">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>Click or drag docker-compose files here to upload</p>
                  </div>
                </Upload>
                <div v-if="this.upload.file !== null"> {{ this.upload.file.name }}</div>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit('upload')">提交</Button>
                <Button @click="handleReset('upload')" style="margin-left: 8px">重置</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
      <!--Step3,构建YAML              -->
      <div v-show="!isEmpty(download.composePath)">
        <h2 id="download">
          <Badge :count="3" type="info"></Badge>
          下载YAML
        </h2>
        <p>此步骤可下载已成功构建的YAML文件。
          <Button icon="md-cloud-download" type="success" @click="downloadZip">下载</Button>
        </p>
      </div>
    </div><!--end docker-compose构建 -->
    <!--向导式构建              -->
    <div v-show="isCurrentConstruction('向导式构建')">
      <!--Step2,填写对象名称              -->
      <div>
        <h2 id="service_name">
          <Badge :count="2" type="info"></Badge>
          填写对象名称
        </h2>
        <p>此步骤进行对象名称的填写，以及对象类型的选择。</p>
        <Card style="background-color: #f5f7f9">
          <div :style="{width:'600px',margin:'0 auto'}">
            <Form ref="formInline" :label-width="160" inline onsubmit="return false;">
              <FormItem label="对象名称">
                <Row>
                  <Col span="20" style="padding-right:10px">
                    <Input v-model="judge.resource.name" placeholder="Enter the name"
                           @keyup.enter.native="addResource"/>
                  </Col>
                  <Col span="3" offset="1">
                    <Button icon="ios-add" type="dashed" size="small" @click="addResource">添加对象</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="对象类别">
                <RadioGroup v-model="judge.resource.type">
                  <Radio label="资源对象" border></Radio>
                  <Radio label="配置对象" border></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="具体对象">
                <RadioGroup v-model="judge.resource.target" v-show="isTargetResourceType('资源对象')">
                  <Radio label="Pod" border></Radio>
                  <Radio label="ReplicaSet" border></Radio>
                  <Radio label="Deployment" border></Radio>
                </RadioGroup>
                <RadioGroup v-model="judge.resource.target" v-show="isTargetResourceType('配置对象')">
                  <Radio label="Secret" border></Radio>
                  <Radio label="ConfigMap" border></Radio>
                  <Radio label="Service" border></Radio>
                </RadioGroup>
                <div>
                  <p v-show="!isArrayEmpty(judge.nameCollection.pod)">
                    Pod:
                    <Tag v-for="item in judge.nameCollection.pod" :key="item" :name="item"
                         type="dot" color="primary" closable @on-close="removeResource('Pod',item)">
                      {{ item }}
                    </Tag>
                  </p>
                  <p v-show="!isArrayEmpty(judge.nameCollection.replicaSet)">
                    ReplicaSet:
                    <Tag v-for="item in judge.nameCollection.replicaSet" :key="item" :name="item"
                         type="dot" color="primary" closable @on-close="removeResource('ReplicaSet',item)">
                      {{ item }}
                    </Tag>
                  </p>
                  <p v-show="!isArrayEmpty(judge.nameCollection.deployment)">
                    Deployment:
                    <Tag v-for="item in judge.nameCollection.deployment" :key="item" :name="item"
                         type="dot" color="primary" closable @on-close="removeResource('Deployment',item)">
                      {{ item }}
                    </Tag>
                  </p>
                  <p v-show="!isArrayEmpty(judge.nameCollection.secret)">
                    Secret:
                    <Tag v-for="item in judge.nameCollection.secret" :key="item" :name="item"
                         type="dot" color="primary" closable @on-close="removeResource('Secret',item)">
                      {{ item }}
                    </Tag>
                  </p>
                  <p v-show="!isArrayEmpty(judge.nameCollection.configMap)">
                    ConfigMap:
                    <Tag v-for="item in judge.nameCollection.configMap" :key="item" :name="item"
                         type="dot" color="primary" closable @on-close="removeResource('ConfigMap',item)">
                      {{ item }}
                    </Tag>
                  </p>
                  <p v-show="!isArrayEmpty(judge.nameCollection.service)">
                    Service:
                    <Tag v-for="item in judge.nameCollection.service" :key="item" :name="item"
                         type="dot" color="primary" closable @on-close="removeResource('Service',item)">
                      {{ item }}
                    </Tag>
                  </p>
                </div>
              </FormItem>
            </Form>

          </div>
        </Card>
      </div>
      <!--Step2,具体信息的填写              -->
      <div>
        <h2 id="service_info">
          <Badge :count="3" type="info"></Badge>
          填写对象具体信息
        </h2>
        <p>此步骤进行具体信息的填写，是对象的重要构成要素。</p>
        <div v-show="!isArrayEmpty(judge.nameCollection.secret)">
          <Divider>Secret</Divider>
          <div v-for="(item,index) in judge.nameCollection.secret" style="margin-top: 15px;">
            <Secret ref="secret" :resourceName="item" :key="item"></Secret>
          </div>
        </div>
        <div v-show="!isArrayEmpty(judge.nameCollection.configMap)">
          <Divider>ConfigMap</Divider>
          <div v-for="(item,index) in judge.nameCollection.configMap" style="margin-top: 15px;">
            <ConfigMap ref="configMap" :resourceName="item" :key="item"></ConfigMap>
          </div>
        </div>
        <div v-show="!isArrayEmpty(judge.nameCollection.pod)">
          <Divider>Pod</Divider>
          <div v-for="(item,index) in judge.nameCollection.pod" style="margin-top: 15px;">
            <Pod ref="pod" :resourceName="item"></Pod>
          </div>
        </div>
        <div v-show="!isArrayEmpty(judge.nameCollection.replicaSet)">
          <Divider>ReplicaSet</Divider>
          <div v-for="(item,index) in judge.nameCollection.replicaSet" style="margin-top: 15px;">
            <ReplicaSet ref="replicaSet" :resourceName="item" :key="item"></ReplicaSet>
          </div>
        </div>
        <div v-show="!isArrayEmpty(judge.nameCollection.deployment)">
          <Divider>Deployment</Divider>
          <div v-for="(item,index) in judge.nameCollection.deployment" style="margin-top: 15px;">
            <Deployment ref="deployment" :resourceName="item" :key="item"></Deployment>
          </div>
        </div>
        <div v-show="!isArrayEmpty(judge.nameCollection.service)">
          <Divider>Service</Divider>
          <div v-for="(item,index) in judge.nameCollection.service" style="margin-top: 15px;">
            <Service ref="service" :resourceName="item" :key="item"></Service>
          </div>
        </div>
      </div>
      <!--Step3,构建YAML              -->
      <div>
        <h2 id="create_yaml">
          <Badge :count="4" type="info"></Badge>
          文件生成
        </h2>
        <p>此步骤依据上述对象填写信息，进行kubernetes文件生成。
          <Button icon="md-cog" type="primary" @click="createKubernetes()">构 建</Button>&nbsp;
          <Button icon="md-cloud-download" type="success" v-show="!isEmpty(download.guidePath)" @click="downloadZip">下载</Button>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
//import common components
import Editor from '../components/Editor.vue';


import YAML from 'json2yaml';
import Secret from "@/components/Kubernetes/Secret";
import ConfigMap from "@/components/Kubernetes/ConfigMap";
import Service from "@/components/Kubernetes/Service";
import Pod from "@/components/Kubernetes/Pod";
import ReplicaSet from "@/components/Kubernetes/ReplicaSet";
import Deployment from "@/components/Kubernetes/Deployment";
import commonUtil from "@/commonUtil";

import {createKubeByCompose, createKubeByGuide, downloadKube} from "@/request";

export default {
  name: "CreateKubernetes",
  components: {
    Editor,
    ConfigMap, Secret, Service,
    Pod, ReplicaSet, Deployment
  },
  watch: {
    'judge.resource.type': {
      handler() {
        this.judge.resource.target = this.isTargetResourceType("资源对象") ? "Pod" : "Secret";
      }
    }
  },
  data() {
    return {
      temp: {construction: 'Docker-Compose'},
      //用于控制页面显示信息的 数据结构。
      judge: {
        resource: {name: '', type: '资源对象', target: 'Pod'},
        //用于存储对象名称的数组集合
        nameCollection: {pod: [], replicaSet: [], deployment: [], secret: [], configMap: [], service: []},
      },
      upload: {format: 'YAML', organization: 'HELM', target: 'Deployment', file: ''},
      download: {composePath: '', guidePath: '',}
    }
  },
  methods: {
    isCurrentConstruction(name) {
      return this.temp.construction === name;
    },
    isTargetResourceType(type) {
      return this.judge.resource.type === type;
    },
    isArrayEmpty(arr) {
      return arr.length <= 0;
    },
    //上传文件 前置方法
    beforeUpload(file) {
      this.upload.file = file;
      return false;
    },
    //重置按钮
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //提交按钮
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.upload.file === "") {
            commonUtil.error("文件不能为空！");
            return;
          }
          this.handleUpload();
          this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    //上传文件 方法
    handleUpload() {
      let formData = this.transferUpload();
      let config = {headers: {'Content-Type': 'multipart/form-data'}};
      this.$axios.post(createKubeByCompose, formData, config).then((response) => {
        //根据返回码 进行消息显示处理
        this.download.composePath = response.data.data.targetPath;
        let code = response.data.code;
        let message = response.data.message;
        if (code !== 200) {
          commonUtil.error(message);
        } else {
          commonUtil.success(message);
        }
      }).catch((error) => {
        commonUtil.error("文件上传错误！！！");
      });
    },
    //转换 formValidate值
    transferUpload() {
      let formData = new FormData();
      formData.append('format', this.upload.format);
      formData.append('organization', this.upload.organization);
      formData.append('target', this.upload.target);
      formData.append('file', this.upload.file);

      return formData;
    },
    //下载文件包
    downloadZip() {
      let pathArray;
      if (this.isCurrentConstruction('Docker-Compose')) {
        pathArray = this.download.composePath.split("/");
      } else {
        pathArray = this.download.guidePath.split("/");
      }
      window.location.href = downloadKube + pathArray[3];
    },
    //添加资源
    addResource() {
      let flag = commonUtil.isStrEmpty(this.judge.resource.name);
      if (flag) {
        return;
      }
      let target = this.judge.resource.target;
      let name = this.judge.resource.name;
      let collection = this.judge.nameCollection;
      switch (target) {
        case 'Pod':
          this.$store.commit('addPodName', name);
          this.doAddResource(name, collection.pod);
          break;
        case 'ReplicaSet':
          this.$store.commit('addReplicaSetName', name);
          this.doAddResource(name, collection.replicaSet);
          break;
        case 'Deployment':
          this.$store.commit('addDeploymentName', name);
          this.doAddResource(name, collection.deployment);
          break;
        case 'Secret':
          //同步更新vuex中store的secret数据
          this.$store.commit('addSecretName', name);
          this.doAddResource(name, collection.secret);
          break;
        case 'ConfigMap':
          //同步更新vuex中store的configMap数据
          this.$store.commit('addConfigMapName', name);
          this.doAddResource(name, collection.configMap);
          break;
        case 'Service':
          this.doAddResource(name, collection.service);
          break;
      }
    },
    //真正添加资源函数
    doAddResource(name, array) {
      //为了防止出现重复的对象名，先删后加
      this.doRemoveResource(name, array);
      array.push(name);
      this.judge.resource.name = "";
    },
    //删除资源
    removeResource(type, name) {
      let collection = this.judge.nameCollection;
      switch (type) {
        case 'Pod':
          this.$store.commit('removePodName', name);
          this.doRemoveResource(name, collection.pod);
          break;
        case 'ReplicaSet':
          this.$store.commit('removeReplicaSetName', name);
          this.doRemoveResource(name, collection.replicaSet);
          break;
        case 'Deployment':
          this.$store.commit('removeDeploymentName', name);
          this.doRemoveResource(name, collection.deployment);
          break;
        case 'Secret':
          //同步更新vuex中store的secret数据
          this.$store.commit('removeSecretName', name);
          this.doRemoveResource(name, collection.secret);
          break;
        case 'ConfigMap':
          //同步更新vuex中store的configMap数据
          this.$store.commit('removeConfigMapName', name);
          this.doRemoveResource(name, collection.configMap);
          break;
        case 'Service':
          this.doRemoveResource(name, collection.service);
          break;
      }
    },
    //真正删除Resource的函数
    doRemoveResource(name, array) {
      const index = array.indexOf(name);
      if (index >= 0) {
        array.splice(index, 1);
      }
    },
    //构建代码
    createKubernetes() {
      let secrets = this.judge.nameCollection.secret;
      let configMaps = this.judge.nameCollection.configMap;
      let services = this.judge.nameCollection.service;

      let pods = this.judge.nameCollection.pod;
      let deployments = this.judge.nameCollection.deployment;
      let replicaSets = this.judge.nameCollection.replicaSet;

      //判断对象个数是否为空
      let isObjNotEmpty = !commonUtil.isArrayEmpty(secrets) || !commonUtil.isArrayEmpty(configMaps)
          || !commonUtil.isArrayEmpty(services) || !commonUtil.isArrayEmpty(pods)
          || !commonUtil.isArrayEmpty(replicaSets) || !commonUtil.isArrayEmpty(deployments);
      if (!isObjNotEmpty) {
        this.$Message.error("对象个数不能为0！");
        return;
      }

      let flag = this.checkRequiredFields(secrets, configMaps, services, pods, deployments, replicaSets);
      if (flag) {
        this.integrateService(secrets, configMaps, services, pods, deployments, replicaSets);
      }
    },
    //检查必填项，所有对象的必填项是否已填写
    checkRequiredFields(secrets, configMaps, services, pods, deployments, replicaSets) {
      //对各项进行数据校验
      let secretFlag = true, configMapFlag = true, serviceFlag = true,
          podFlag = true, replicaSetFlag = true, deploymentFlag = true;
      for (let index = 0; index < secrets.length; index++) {
        secretFlag &= this.$refs.secret[index].checkRequiredFields();
      }
      for (let index = 0; index < configMaps.length; index++) {
        configMapFlag &= this.$refs.configMap[index].checkRequiredFields();
      }
      for (let index = 0; index < services.length; index++) {
        serviceFlag &= this.$refs.service[index].checkRequiredFields();
      }

      for (let index = 0; index < pods.length; index++) {
        podFlag &= this.$refs.pod[index].checkRequiredFields();
      }
      for (let index = 0; index < replicaSets.length; index++) {
        replicaSetFlag &= this.$refs.replicaSet[index].checkRequiredFields();
      }
      for (let index = 0; index < deployments.length; index++) {
        deploymentFlag &= this.$refs.deployment[index].checkRequiredFields();
      }

      //进行信息提示
      if (!secretFlag) {
        commonUtil.error("secret必填项未填写");
      }
      if (!configMapFlag) {
        commonUtil.error("configMap必填项未填写");
      }
      if (!serviceFlag) {
        commonUtil.error("service必填项未填写");
      }
      if (!podFlag) {
        commonUtil.error("pod必填项未填写");
      }
      if (!replicaSetFlag) {
        commonUtil.error("replicaSet必填项未填写");
      }
      if (!deploymentFlag) {
        commonUtil.error("deployment必填项未填写");
      }
      //flag为true代表校验通过
      let flag = secretFlag && configMapFlag && serviceFlag && podFlag && replicaSetFlag && deploymentFlag;

      return flag;
    },
    integrateService(secrets, configMaps, services, pods, deployments, replicaSets) {
      //自定义数据结构，用于存储所有对象的JSON及其对象名
      let map = {
        secretName: [],
        configMapName: [],
        serviceName: [],
        podName: [],
        deploymentName: [],
        replicaSetName: [],
        secretJson: [],
        configMapJson: [],
        serviceJson: [],
        podJson: [],
        deploymentJson: [],
        replicaSetJson: []
      };
      for (let index = 0; index < secrets.length; index++) {
        let fileName = secrets[index] + "-secret";
        let json = this.$refs.secret[index].constructJSON();
        map.secretName.push(fileName);
        map.secretJson.push(json);
      }
      for (let index = 0; index < configMaps.length; index++) {
        let fileName = configMaps[index] + "-configMap";
        let json = this.$refs.configMap[index].constructJSON();
        map.configMapName.push(fileName);
        map.configMapJson.push(json);
      }
      for (let index = 0; index < services.length; index++) {
        let fileName = services[index] + "-service";
        let json = this.$refs.service[index].constructJSON();
        map.serviceName.push(fileName);
        map.serviceJson.push(json);
      }

      for (let index = 0; index < pods.length; index++) {
        let fileName = pods[index] + "-pod";
        let json = this.$refs.pod[index].constructJSON();
        map.podName.push(fileName);
        map.podJson.push(json);
      }
      for (let index = 0; index < replicaSets.length; index++) {
        let fileName = replicaSets[index] + "-replicaSet";
        let json = this.$refs.replicaSet[index].constructJSON();
        map.replicaSetName.push(fileName);
        map.replicaSetJson.push(json);
      }
      for (let index = 0; index < deployments.length; index++) {
        let fileName = deployments[index] + "-deployment";
        let json = this.$refs.deployment[index].constructJSON();
        map.deploymentName.push(fileName);
        map.deploymentJson.push(json);
      }
      
      //发送请求
      this.$axios.post(createKubeByGuide, map).then((response) => {
        //根据返回码 进行消息显示处理
        this.download.guidePath = response.data.data.targetPath;
        let code = response.data.code;
        let message = response.data.message;
        if (code !== 200) {
          commonUtil.error(message);
        } else {
          commonUtil.success(message);
        }
      }).catch((error) => {
        commonUtil.error("后台构建出现错误！");
      });

    },
    isEmpty(str) {
      if (typeof str == null || str === "undefined" || str === "") {
        return true;
      }
      //检验字符串是否都为空
      let regex = "^[ ]+$";
      let re = new RegExp(regex);
      return re.test(str);
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