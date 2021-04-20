<template>
  <Form ref="step1" :model="step1" :rules="ruleValidate" :label-width="120" onsubmit="return false;">
    <FormItem label="构建方式">
      <RadioGroup v-model="temp.construction">
        <Radio label="镜像" border></Radio>
        <Radio label="Dockerfile" border></Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="基础镜像" prop="image" v-show="isCurrentConstruction('镜像')">
      <Input v-model="step1.image" placeholder="Enter basic image,for example scratch、mysql "></Input>
    </FormItem>
    <FormItem label="Dockerfile" prop="build" v-show="isCurrentConstruction('Dockerfile')">
      <Row>
        <Col span="3" style="text-align: center">文件名</Col>
        <Col span="8">
          <FormItem>
            <Input v-model="step1.build.dockerfile" placeholder="Enter the file name "></Input>
          </FormItem>
        </Col>
        <Col span="3" offset="1" style="text-align: left">存放路径</Col>
        <Col span="8">
          <FormItem>
            <Input v-model="step1.build.context" placeholder="Enter the file storage path"></Input>
          </FormItem>
        </Col>
      </Row>
      <div class="asd-inline">提示信息：在Dockerfile中设置的选项(例如：ENV, EXPOSE, VOLUME,CMD等) 将会自动被获取，无需再次设置。</div>
    </FormItem>
    <FormItem label="环境变量">
      <div>
        <Row>
          <Col span="18" style="padding-right:10px">
            <Input v-model="temp.env_file" placeholder="Enter the environment file (contain path)"
                   @keyup.enter.native="addEnvFile"/>
          </Col>
          <Col span="3" offset="1">
            <Button icon="ios-add" type="dashed" size="small" @click="addEnvFile">添加文件</Button>
          </Col>
        </Row>
        <Tag v-for="item in step1.env_file" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeEnvFile">
          {{ item }}
        </Tag>
      </div>
      <div style="margin-top: 8px">
        <Row>
          <Col span="8">
            <Input v-model="temp.environment.key" placeholder="Enter the key"/>
          </Col>
          <Col span="9" offset="1" style="padding-right:10px">
            <Input v-model="temp.environment.value" placeholder="Enter the value" @keyup.enter.native="addEnv"/>
          </Col>
          <Col span="3" offset="1">
            <Button icon="ios-add" type="dashed" size="small" @click="addEnv">添加变量</Button>
          </Col>
        </Row>
        <Tag v-for="item in step1.environment" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeEnv">
          {{ item }}
        </Tag>
      </div>
    </FormItem>
    <FormItem label="开放端口">
      <Row>
        <Col span="18" style="padding-right:10px">
          <Input v-model="temp.expose" placeholder="Enter the expose port" @keyup.enter.native="addPort"/>
        </Col>
        <Col span="3" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addPort">添加端口</Button>
        </Col>
      </Row>
      <Tag v-for="item in step1.expose" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removePort">
        {{ item }}
      </Tag>
    </FormItem>

    <FormItem label="启动命令/脚本" prop="entrypoint">
      <Input v-model="step1.entrypoint" placeholder="Enter start command or script name"></Input>
    </FormItem>

  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Step1",
  data() {
    return {
      temp: {
        construction: '镜像',
        env_file: '',
        environment: {key: '', value: ''},
        expose: '',
      },
      step1: {
        image: '',
        build: {context: '', dockerfile: ''},
        env_file: [],
        environment: [],
        expose: [],
        entrypoint: '',
      },
      index: 0,
      ruleValidate: {
        image: [
          {required: true, message: 'The image cannot be empty', trigger: 'blur'}
        ],
        build: [
          {required: true, message: 'The content cannot be empty', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    isCurrentConstruction(value) {
      return this.temp.construction === value;
    },
    //环境变量文件
    addEnvFile() {
      if (commonUtil.isStrEmpty(this.temp.env_file)) {
        commonUtil.error("添加环境变量文件失败，内容不能为空");
      } else {
        this.step1.env_file.push(this.temp.env_file.trim());
        this.temp.env_file = "";
      }
    },
    removeEnvFile(event, name) {
      let index = this.step1.env_file.indexOf(name);
      this.step1.env_file.splice(index, 1);
    },
    //环境变量相关方法：添加环境变量、删除环境变量
    addEnv() {
      let key = this.temp.environment.key.trim();
      let value = this.temp.environment.value.trim();
      if (commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value)) {
        commonUtil.error("添加环境变量失败，内容不能为空");
      } else {
        let str = key + "=" + value;
        this.step1.environment.push(str);
        //数据置空
        this.temp.environment.key = "";
        this.temp.environment.value = "";
      }
    },
    removeEnv(event, name) {
      let index = this.step1.environment.indexOf(name);
      this.step1.environment.splice(index, 1);
    },
    //端口相关方法：添加端口、删除端口
    addPort() {
      let expose = this.temp.expose.trim();
      if (commonUtil.isStrEmpty(expose)) {
        commonUtil.error("添加端口失败，内容不能为空");
      } else {
        this.step1.expose.push(expose);
        this.temp.expose = "";
      }
    },
    removePort(event, name) {
      let index = this.step1.expose.indexOf(name);
      this.step1.expose.splice(index, 1);
    },
  }
}
</script>

<style scoped>
.asd-inline {
  background-color: #f8f8f9;
  border-radius: 4px;
  padding: 8px 16px;
  margin: 8px 0 0 0;
  font-size: 14px;
  border: 1px solid #edeff0;
  position: relative;
}
</style>