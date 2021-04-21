<template>
  <Form :label-width="120" :rules="ruleValidate" onsubmit="return false;">
    <FormItem label="容器名称" prop="name">
      <Row>
        <Col span="18" class="paddingRightUnit">
          <Input v-model="container.name" placeholder="输入容器名称"/>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="基础镜像" prop="image">
      <Row>
        <Col span="18" class="paddingRightUnit">
          <Input v-model="container.image" placeholder="输入基础镜像"/>
        </Col>
        <Col span="5" style="margin-left:10px">
          <Select v-model="container.imagePullPolicy">
            <Option value="IfNotPresent" key="IfNotPresent">IfNotPresent</Option>
            <Option value="Always" key="Always">Always</Option>
            <Option value="Never" key="Never">Never</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="工作目录">
      <Row>
        <Col span="18" class="paddingRightUnit">
          <Input v-model="container.workingDir" placeholder="输入容器的工作目录"/>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="端口暴露">
      <div>
        <Row>
          <Col span="8">
            <Input v-model="temp.port.hostPort" placeholder="输入主机端口"/>
          </Col>
          <Col span="9" offset="1" class="paddingRightUnit">
            <Input v-model="temp.port.containerPort" placeholder="输入容器端口" @keyup.enter.native="addPort"/>
          </Col>
          <Col span="2">
            <Button icon="ios-add" type="dashed" size="small" @click="addPort">暴露端口</Button>
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
    <FormItem label="磁盘挂载">
      <Row>
        <Col span="8">
          <Select
              v-model="temp.volumeMount.name"
              placeholder="先进行数据卷创建后选择"
          >
            <Option v-for="(item,index) in temp.volumeMountNames" :value="item.name" :label="item.name" :key="index+item.name">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.type }}</span>
            </Option>
          </Select>
          <!--          <Input v-model="temp.volumeMount.name" placeholder="输入定义的共享存储卷的名称"/>-->
        </Col>
        <Col span="9" offset="1" class="paddingRightUnit">
          <Input v-model="temp.volumeMount.mountPath" placeholder="输入挂载在容器的绝对路径" @keyup.enter.native="addVolumeMount"/>
        </Col>
        <Col span="2">
          <Button icon="ios-add" type="dashed" size="small" @click="addVolumeMount">添加挂载</Button>
        </Col>
        <Col span="1" offset="2">
          <i-switch size="large" v-model="temp.isMountWrite">
            <span slot="open">可写</span>
            <span slot="close">只读</span>
          </i-switch>
        </Col>
      </Row>
      <Row>
        <Col span="18" class="paddingRightUnit">
          <Input v-model="temp.volumeMount.subPath" placeholder="输入相关subPath信息（可选）"/>
        </Col>
      </Row>
      <Tag v-for="item in temp.volumeMounts" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removeVolumeMount">
        {{ item }}
      </Tag>
    </FormItem>
    <FormItem label="环境变量">
      <!--环境变量值      -->
      <div>
        <Row>
          <Col span="5">环境变量创建方式:</Col>
          <Col span="1" offset="1">
            <i-switch size="large" v-model="temp.isEnvSelf">
              <span slot="open">自定义</span>
              <span slot="close">引用</span>
            </i-switch>
          </Col>
          <Col span="5" offset="2">环境变量引用类型:</Col>
          <Col span="1" offset="1">
            <i-switch size="large" v-model="temp.isConfigMap">
              <span slot="open">ConfigMap</span>
              <span slot="close">Secret</span>
            </i-switch>
          </Col>
          <Col span="2" offset="2">
            <Button icon="ios-add" type="dashed" size="small" @click="addEnv">添加变量</Button>
          </Col>
        </Row>
        <!--自定义环境变量值        -->
        <Row v-show="temp.isEnvSelf">
          <Col span="8">
            <Input v-model="temp.environment.key" placeholder="输入环境变量名"/>
          </Col>
          <Col span="9" offset="1" class="paddingRightUnit">
            <Input v-model="temp.environment.value" placeholder="输入环境变量值" @keyup.enter.native="addEnv"/>
          </Col>
        </Row>
        <!--引用环境变量值        -->
        <Row v-show="!temp.isEnvSelf">
          <Col span="7">
            <Input v-model="temp.envValueFrom.name" placeholder="输入环境变量名"/>
          </Col>
          <Col span="8" offset="1">
            <Select
                v-model="temp.envValueFrom.valueFrom.keyRef.name"
                filterable
                :placeholder="tips.envValueFrom.valueFrom.keyRef.name"
            >
              <Option v-for="item in $store.state.configMap.names" :value="item" :key="item" v-if="temp.isConfigMap">
                {{ item }}
              </Option>
              <Option v-for="item in $store.state.secret.names" :value="item" :key="item" v-if="!temp.isConfigMap">
                {{ item }}
              </Option>
            </Select>
          </Col>
          <Col span="7" offset="1">
            <Input v-model="temp.envValueFrom.valueFrom.keyRef.key"
                   :placeholder="tips.envValueFrom.valueFrom.keyRef.key"/>
          </Col>
        </Row>
        <Tag v-for="item in temp.env" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeEnv">
          {{ item }}
        </Tag>
      </div>
      <!--文件引用      -->
      <div style="margin-top: 8px">
        <Row>
          <Col span="18" class="paddingRightUnit">
            <Select
                v-model="temp.envRef"
                filterable
                :placeholder="tips.envRef"
            >
              <Option v-for="item in $store.state.configMap.names" :value="item" :key="item" v-if="temp.isConfigMapRef">
                {{ item }}
              </Option>
              <Option v-for="item in $store.state.secret.names" :value="item" :key="item" v-if="!temp.isConfigMapRef">
                {{ item }}
              </Option>
            </Select>
          </Col>
          <Col span="2">
            <Button icon="ios-add" type="dashed" size="small" @click="addEnvFrom">文件引用</Button>
          </Col>
          <Col span="1" offset="2">
            <i-switch size="large" v-model="temp.isConfigMapRef">
              <span slot="open">ConfigMap</span>
              <span slot="close">Secret</span>
            </i-switch>
          </Col>
        </Row>
        <Tag v-for="item in temp.envFrom" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeEnvFrom">
          {{ item }}
        </Tag>
      </div>
    </FormItem>
    <FormItem label="资源限制">
      <Row>
        <Col span="8"><Input v-model="container.resources.requests.cpu" placeholder="初始化CPU,0-1"></Input></Col>
        <Col span="9" offset="1" class="paddingRightUnit"><Input v-model="container.resources.requests.memory"
                                                                 placeholder="初始化内存,如256M"></Input></Col>
      </Row>
      <Row>
        <Col span="8"><Input v-model="container.resources.limits.cpu" placeholder="最大CPU,0-1"></Input></Col>
        <Col span="9" offset="1" class="paddingRightUnit"><Input v-model="container.resources.limits.memory"
                                                                 placeholder="最大内存,如1G"></Input></Col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Container",
  props: {
    resourceType: String,
    resourceName: String
  },
  computed: {
    stateVolume() {
      let volumes;
      switch (this.resourceType) {
        case 'pod':
          volumes = this.$store.state.pod.volumes;
          break;
        case 'replicaSet':
          volumes = this.$store.state.replicaSet.volumes;
          break;
        case 'deployment':
          volumes = this.$store.state.deployment.volumes;
          break;
      }
      return volumes;
    }
  },
  watch: {
    stateVolume: {
      handler() {
        let names, volumes;
        switch (this.resourceType) {
          case 'pod':
            names = this.$store.state.pod.names;
            volumes = this.$store.state.pod.volumes;
            break;
          case 'replicaSet':
            names = this.$store.state.replicaSet.names;
            volumes = this.$store.state.replicaSet.volumes;
            break;
          case 'deployment':
            names = this.$store.state.deployment.names;
            volumes = this.$store.state.deployment.volumes;
            break;
        }
        let index = names.indexOf(this.resourceName);
        this.temp.volumeMountNames = volumes[index];
      },
      deep: true,

    },
    'temp.isConfigMap': {
      handler() {
        let flag = this.temp.isConfigMap;
        let keyTip = flag ? "输入ConfigMapKeyRef" : "输入SecretKeyRef";
        let nameTip = flag ? "选择ConfigMap的名字" : "选择Secret的名字";
        this.tips.envValueFrom.valueFrom.keyRef.name = nameTip;
        this.tips.envValueFrom.valueFrom.keyRef.key = keyTip;
      }
    },
    'temp.isConfigMapRef': {
      handler() {
        let flag = this.temp.isConfigMapRef;
        let tip = flag ? "选择相关ConfigMap的名字(即envFrom信息)" : "选择相关Secret的名字(即envFrom信息)";
        this.tips.envRef = tip;
      }
    },
    'container.volumeMounts': {
      handler(){

      },
      deep: true
    }
  },
  data() {
    return {
      temp: {
        //switch绑定信息
        isTcp: true, isConfigMap: true, isConfigMapRef: true, isEnvSelf: true, isMountWrite: true,
        //select选择框的构造数据
        secretRefs: [], configMapRefs: [],
        //端口映射信息
        port: {containerPort: '', hostPort: '', protocol: ''},
        //环境变量 相关信息
        envRef: "",
        environment: {key: "", value: ""},
        envValueFrom: {name: "", valueFrom: {keyRef: {name: "", key: ""}}},
        envValueFromSecret: {name: "", valueFrom: {secretKeyRef: {name: "", key: ""}}},
        envValueFromConfigMap: {name: "", valueFrom: {configMapKeyRef: {name: "", key: ""}}},
        //磁盘挂载
        volumeMountNames: [],
        volumeMount: {name: "", mountPath: "", subPath: "", readOnly: "true"},
        //资源限制信息
        resource: {},
        ports: [], env: [], envFrom: [], volumeMounts: [], containers: [],
      },
      container: {
        name: "",
        image: "",
        imagePullPolicy: "IfNotPresent",
        command: "",
        args: [],
        workingDir: "",
        volumeMounts: [],
        ports: [],
        env: [],
        envFrom: [],
        resources: {
          limits: {cpu: "", memory: ""},
          requests: {cpu: "", memory: ""}
        }
      },
      containers: [],
      //提示信息
      tips: {
        envRef: "选择相关ConfigMap的名字(即envFrom信息)",
        envValueFrom: {valueFrom: {keyRef: {name: "选择ConfigMap的名字", key: "输入configMapKeyRef"}}}
      },
      ruleValidate: {
        name: [{required: true, message: "container name is require"}],
        image: [{required: true}],
      }
    }
  },
  methods: {
    integrateContainer() {
      let container = commonUtil.deepClone(this.container);
      //判断属性字符串是否为空
      if (commonUtil.isStrEmpty(container.command)) {
        delete container.command;
      }
      if (commonUtil.isStrEmpty(container.workingDir)) {
        delete container.workingDir;
      }
      //判断属性数组是否为空
      if (commonUtil.isArrayEmpty(container.args)) {
        delete container.args;
      }
      if (commonUtil.isArrayEmpty(container.volumeMounts)) {
        delete container.volumeMounts;
      }
      if (commonUtil.isArrayEmpty(container.ports)) {
        delete container.ports;
      }
      if (commonUtil.isArrayEmpty(container.env)) {
        delete container.env;
      }
      if (commonUtil.isArrayEmpty(container.envFrom)) {
        delete container.envFrom;
      }

      //resource字段属性，先从基础的开始进行判断删除，再删除最高一级的resource
      let resources = container.resources;
      let limitCpuFlag = commonUtil.isStrEmpty(resources.limits.cpu);
      let limitMemoryFlag = commonUtil.isStrEmpty(resources.limits.memory);
      let limitFlag = limitCpuFlag && limitMemoryFlag;
      if (limitFlag) {
        delete container.resources.limits;
      } else {
        if (limitCpuFlag) {
          delete container.resources.limits.cpu;
        }
        if (limitMemoryFlag) {
          delete container.resources.limits.memory;
        }
      }

      let requestCpuFlag = commonUtil.isStrEmpty(resources.requests.cpu);
      let requestMemoryFlag = commonUtil.isStrEmpty(resources.requests.memory);
      let requestFlag = requestCpuFlag && requestMemoryFlag;
      if (requestFlag) {
        delete container.resources.requests;
      } else {
        if (requestCpuFlag) {
          delete container.resources.requests.cpu;
        }
        if (requestMemoryFlag) {
          delete container.resources.requests.memory;
        }
      }

      let resourceFlag = limitFlag && requestFlag;
      if (resourceFlag) {
        delete container.resources;
      }

      return container;
    },
    //端口映射
    addPort() {
      let hostPort = this.temp.port.hostPort.trim();
      let containerPort = this.temp.port.containerPort.trim();
      let flag = commonUtil.isStrEmpty(containerPort);
      if (flag) {
        commonUtil.error("添加暴露端口失败，容器端口内容不能为空");
      } else {
        //构建对象并进行存储
        let obj = {};
        obj["containerPort"] = containerPort;
        let str = containerPort;

        //判断hostPort是否为空，进行相应处理
        if (!commonUtil.isStrEmpty(hostPort)) {
          obj["hostPort"] = hostPort;
          str = hostPort + ":" + containerPort;
        }

        if (!this.temp.isTcp) {
          str += "/udp";
          obj["protocol"] = "UDP";
        }
        this.container.ports.push(obj);
        //添加相应标签信息
        this.temp.ports.push(str);
        this.temp.port.hostPort = "";
        this.temp.port.containerPort = "";
      }
    },
    removePort(event, name) {
      let index = this.temp.ports.indexOf(name);
      this.temp.ports.splice(index, 1);
      this.container.ports.splice(index, 1);
    },
    //磁盘挂载
    addVolumeMount() {
      let name = this.temp.volumeMount.name.trim();
      let mountPath = this.temp.volumeMount.mountPath.trim();
      let subPath = this.temp.volumeMount.subPath.trim();
      let flag = commonUtil.isStrEmpty(name) || commonUtil.isStrEmpty(mountPath);
      if (flag) {
        commonUtil.error("添加磁盘挂载失败，有内容尚未填写");
      } else {
        //消除空格
        this.temp.volumeMount.name = name;
        this.temp.volumeMount.mountPath = mountPath;
        this.temp.volumeMount.readOnly = !this.temp.isMountWrite;
        if (this.temp.isMountWrite) {
          delete this.temp.volumeMount.readOnly;
        }
        if (commonUtil.isStrEmpty(subPath)) {
          delete this.temp.volumeMount.subPath;
        }
        this.container.volumeMounts.push(commonUtil.deepClone(this.temp.volumeMount));
        //重新构建subPath属性，因为可能被删除。
        this.temp.volumeMount["subPath"] = "";
        this.temp.volumeMount["readOnly"] = "true";
        //添加提示信息
        let str = name;
        if (!this.temp.isMountWrite) {
          str += "/read"
        }
        this.temp.volumeMounts.push(str);
        //内容清空
        this.temp.volumeMount.name = "";
        this.temp.volumeMount.mountPath = "";
        this.temp.volumeMount.subPath = "";
      }
    },
    removeVolumeMount(event, name) {
      let index = this.temp.volumeMounts.indexOf(name);
      this.temp.volumeMounts.splice(index, 1);
      this.container.volumeMounts.splice(index, 1);
    },
    //环境变量引用
    addEnvFrom() {
      let envRef = this.temp.envRef;
      if (commonUtil.isStrEmpty(envRef)) {
        commonUtil.error("添加环境变量引用失败，内容不能为空");
      } else {
        let obj;
        //构建对象并进行添加
        if (this.temp.isConfigMapRef) {
          obj = {configMapRef: {name: envRef}};
        } else {
          obj = {secretRef: {name: envRef}};
        }
        this.container.envFrom.push(obj);
        //添加相应标签信息
        this.temp.envFrom.push(envRef);
        this.temp.envRef = "";
      }
      console.log(JSON.stringify(this.temp.envFrom));
    },
    removeEnvFrom(event, name) {
      let index = this.temp.envFrom.indexOf(name);
      this.temp.envFrom.splice(index, 1);
      this.container.envFrom.splice(index, 1);
    },
    //环境变量
    addEnv() {
      if (this.temp.isEnvSelf) {
        this.addEnvironment();
      } else {
        this.addEnvValueFrom()
      }
    },
    addEnvironment() {
      let key = this.temp.environment.key.trim();
      let value = this.temp.environment.value.trim();
      let flag = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (flag) {
        commonUtil.error("添加环境变量失败，内容不能为空");
      } else {
        //构建对象并进行添加
        let obj = {name: key, value: value};
        this.container.env.push(obj);

        //添加相应标签信息
        let str = key + "=" + value;
        this.temp.env.push(str);
        this.temp.environment.key = "";
        this.temp.environment.value = "";
      }
    },
    addEnvValueFrom() {
      let name = this.temp.envValueFrom.name.trim();
      let refName = this.temp.envValueFrom.valueFrom.keyRef.name.trim();
      let refKey = this.temp.envValueFrom.valueFrom.keyRef.key.trim();
      let flag = commonUtil.isStrEmpty(name) || commonUtil.isStrEmpty(refName) || commonUtil.isStrEmpty(refKey);
      if (flag) {
        commonUtil.error("添加环境变量失败，内容不能为空");
      } else {
        //判断envValueFrom类型是 Secret还是ConfigMap
        if (this.temp.isConfigMap) {
          //确保值无多余空格
          this.temp.envValueFromConfigMap.name = name;
          this.temp.envValueFromConfigMap.valueFrom.configMapKeyRef.name = refName;
          this.temp.envValueFromConfigMap.valueFrom.configMapKeyRef.key = refKey;
          //直接添加ConfigMap对象
          this.container.env.push(this.temp.envValueFromConfigMap);
        } else {
          //确保值无多余空格
          this.temp.envValueFromSecret.name = name;
          this.temp.envValueFromSecret.valueFrom.secretKeyRef.name = refName;
          this.temp.envValueFromSecret.valueFrom.secretKeyRef.key = refKey;
          //直接添加Secret对象
          this.container.env.push(this.temp.envValueFromSecret);
        }
        //添加相应标签信息
        let str = name + "=" + refName + "." + refKey;
        this.temp.env.push(str);
        this.temp.envValueFrom.name = "";
        this.temp.envValueFrom.valueFrom.keyRef.name = "";
        this.temp.envValueFrom.valueFrom.keyRef.key = "";
      }
    },
    removeEnv(event, name) {
      let index = this.temp.env.indexOf(name);
      this.temp.env.splice(index, 1);
      this.container.env.splice(index, 1);
    },
  }
}
</script>

<style scoped>
.paddingRightUnit {
  padding-right: 10px;
}
</style>