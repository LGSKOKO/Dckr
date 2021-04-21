<template>
  <div>
    <div class="wrapper-content ivu-article">
      <h1>Rancher</h1>
      <!--Step1,选择构建方式              -->
      <div>
        <h2 id="build_way">
          <Badge :count="1" type="info"></Badge>
          选择构建方式
        </h2>
        <p>此步骤进行构建方式的选择，构建方式的不同所填信息也不同。</p>
        <Card style="background-color: #f5f7f9">
          <div :style="{maxWidth:'650px',margin:'0 auto'}">
            <Form :label-width="160" inline>
              <FormItem label="构建方式">
                <RadioGroup v-model="build.way">
                  <Radio label="Docker-Compose" border></Radio>
                  <Radio label="Kubernetes(Helm)" border></Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
      <!--Step2,文件上传  -->
      <div>
        <h2>
          <Badge :count="2" type="info"></Badge>
          相关文件上传
        </h2>
        <p>{{ buildTip('p') }}</p>
        <Card style="background-color: #f5f7f9">
          <div :style="{maxWidth: '650px',margin:'0 auto'}">
            <Form ref="upload">
              <FormItem>
                <Upload
                    multiple
                    type="drag"
                    action=""
                    :before-upload="beforeUpload">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>{{ buildTip('upload') }}</p>
                  </div>
                </Upload>
                <p v-if="this.upload.file !== null" style="margin-top: -10px">
                  {{ this.upload.file.name }}
                </p>
              </FormItem>
              <FormItem style="margin-top: -15px">
                <Button type="primary" @click="handleSubmit('upload')">提交</Button>
                <Button @click="handleReset('upload')" style="margin-left: 8px">重置</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
      <!--Step3,构建value.yaml              -->
      <div v-show="!isUploadPathEmpty()">
        <h2>
          <Badge :count="3" type="info"></Badge>
          构建values.yaml
        </h2>
        <p>此步骤根据勾选、填写的信息，进行构建values.yaml文件。</p>
        <Card style="background-color: #f5f7f9">
          <div :style="{maxWidth:'650px',margin:'0 auto'}">
            <Form :label-width="120">
              <FormItem label="构建方式">
                <RadioGroup v-model="build.methodV">
                  <Radio label="默认" border></Radio>
                  <Radio label="自定义" border></Radio>
                </RadioGroup>
              </FormItem>

              <FormItem label="配置项" v-show="'默认'===build.methodV">
                <div v-for="(item,index) in receiveFileArray">
                  <p>{{ item }}
                    <Checkbox
                        :indeterminate="rancher.default.indeterminateV[index]"
                        :value="rancher.default.checkAllV[index]"
                        @click.prevent.native="handleRancherDefaultCheckAllV(index)">全选
                    </Checkbox>
                  </p>
                  <CheckboxGroup v-model="rancher.default.checkAllGroupV[index]"
                                 @on-change="rancherDefaultCheckAllGroupVChange(index,rancher.default.checkAllGroupV[index])">

                    <Checkbox v-for="(checkItem,checkIndex) in checkArray[index]" :key="checkItem"
                              :label="filterCheck(index,checkItem)"></Checkbox>
                  </CheckboxGroup>
                </div>
              </FormItem>
              <div v-show="'自定义'===build.methodV">
                <div style="margin-left: 120px;">
                  <h2>功能暂未实现！！!</h2>
                </div>
                <!--功能暂未实现，搁浅                        -->
                <div hidden>
                  <FormItem label="文件名">
                    <Select v-model="judge.selector.valuesYaml.fileNameIndex" clearable style="width:450px">
                      <Option v-for="(item,index) in this.receiveFileArray" :value="index" :key="item">
                        {{ item }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="配置项">
                    <Select v-model="judge.selector.valuesYaml.configItem" clearable style="width:450px">
                      <Option v-for="item in this.checkArray[judge.selector.valuesYaml.fileNameIndex]"
                              :value="item" :key="item">{{ item }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="映射键">
                    <Input v-model="judge.selector.valuesYaml.keyContent"
                           placeholder="For example,filename.metadata.name" style="width: 450px"/>
                  </FormItem>
                  <FormItem label="映射值">
                    <Input v-model="judge.selector.valuesYaml.valueContent"
                           :placeholder="judge.selector.valuesYaml.placeholder" style="width: 450px"/>
                  </FormItem>
                  <FormItem label="">
                    <Button @click="addValuesYamlItem" type="primary">添加</Button>
                  </FormItem>
                </div>
                <!--此处添加标签，点击进行数据删除。                        -->
              </div><!-- end 自定义 -->

            </Form>
          </div>
        </Card>
      </div>
      <!--step4,构建question.yaml文件                -->
      <div v-show="!isUploadPathEmpty()">
        <h2>
          <Badge :count="4" type="info"></Badge>
          构建questions.yaml
        </h2>
        <p>此步骤根据勾选、填写的信息，进行构建questions.yaml文件。
          <!--                    <Button type="primary" @click="constructJsonQ">构建</Button>-->
        </p>
        <Card style="background-color: #f5f7f9">
          <div :style="{maxWidth:'650px',margin:'0 auto'}">
            <Form :label-width="120">
              <FormItem label="构建方式">
                <RadioGroup v-model="build.methodQ">
                  <Radio label="默认" border></Radio>
                  <Radio label="自定义" border></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="配置项" v-show="'默认'===build.methodQ">
                <div v-for="(item,index) in receiveFileArray">
                  <div v-show="rancher.default.checkAllGroupV[index].length > 0">
                    <p>{{ item }}
                      <Checkbox
                          :indeterminate="rancher.default.indeterminateQ[index]"
                          :value="rancher.default.checkAllQ[index]"
                          @click.prevent.native="handleRancherDefaultCheckAllQ(index)">全选
                      </Checkbox>
                    </p>
                    <CheckboxGroup v-model="rancher.default.checkAllGroupQ[index]"
                                   @on-change="rancherDefaultCheckAllGroupQChange(index,rancher.default.checkAllGroupQ[index])">

                      <Checkbox
                          v-for="(checkItem,checkIndex) in rancher.checkAllGroup[index]"
                          :key="checkItem"
                          :label="filterCheck(index,checkItem)"></Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
              </FormItem>
              <div v-show="'自定义'===build.methodQ">
                <FormItem label="文件名">
                  <Select v-model="judge.selector.questionsYaml.fileNameIndex" clearable style="width:450px">
                    <Option v-for="(item,index) in this.receiveFileArray" :value="index" :key="item">
                      {{ item }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="配置项">
                  <Select v-model="judge.selector.questionsYaml.configItem" clearable style="width:450px">
                    <Option v-for="item in this.rancher.checkAllGroup[judge.selector.questionsYaml.fileNameIndex]"
                            :value="item" :key="item">{{ item }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="标题">
                  <Input v-model="judge.selector.questionsYaml.label"
                         placeholder="例如,这是xxx的标题" style="width: 450px"/>
                </FormItem>
                <FormItem label="描述信息">
                  <Input v-model="judge.selector.questionsYaml.description"
                         placeholder="例如,xxx的用途是..." style="width: 450px"/>
                </FormItem>
                <FormItem label="默认值">
                  <Input v-model="judge.selector.questionsYaml.default"
                         placeholder="例如,xxx的用途是..." style="width: 450px"/>
                </FormItem>
                <FormItem label="">
                  <Button @click="addQuestionsYamlItem" type="primary">添加</Button>
                </FormItem>
                <Editor :content="rancher.custom.questionsYaml.content" ref="editor"></Editor>
                <!--标签数组，显示已添加数据，mirrorsCode同步显示，删除亦然-->
              </div>
            </Form>
          </div>
        </Card>
      </div>
      <!--Step5文件构建及下载              -->
      <div v-show="!isUploadPathEmpty()">
        <h2>
          <Badge :count="5" type="info"></Badge>
          文件构建及下载
        </h2>
        <p>
          此步骤进行YAML文件构建，以及压缩包的下载。
          <Button @click="constructYaml" type="primary">构建</Button>
          <Button @click="download" type="success" style="margin-left: 8px" v-show="isShowDownloadButton">下载</Button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
//import common components
import Editor from '../components/Editor.vue';
import json2yaml from 'json2yaml';
import YAML from 'yamljs';
// YAML = require('yamljs');
import {createRancherByCompose, createRancherByKube, createRancherByGuide, downloadRancher} from "@/request";
import commonUtil from "@/commonUtil";

export default {
  name: "CreateRancher",
  components: {
    Editor,
  },
  computed: {
    buildTip() {
      return function (name) {
        if ('Docker-Compose' === this.build.way) {
          return 'p' === name ? '此步骤上传docker-compose文件，直接提交YAML文件即可。' :
              'Click or drag docker-compose file here to upload';
        } else {
          return 'p' === name ? '此步骤上传Kubernetes压缩包，并且以Helm形式为标准进行文件组织。' :
              'Click or drag Kubernetes file here to upload';
        }
      }
    }
  },
  watch: {
    receiveJSONArray: {
      handler() {
        this.constructCheckArray();
      },
      //深度监听
      deep: true,
    },
    checkArray: {
      handler() {
      },
      deep: true,
    },
    objectArray: {
      handler() {
      },
      deep: true,
    },
    'rancher.default.checkAllGroupV': {
      handler() {
        this.rancher.checkAllGroup = this.rancher.default.checkAllGroupV;
      },
      deep: true,
    },
    'rancher.custom.valuesYaml.checkAllGroup': {
      handler() {
        this.rancher.checkAllGroup = this.rancher.custom.valuesYaml.checkAllGroup;
      },
      deep: true
    },
    'targetQuestions.questions': {
      handler() {
        this.rancher.custom.questionsYaml.content = json2yaml.stringify(this.targetQuestions);
      },
      deep: true
    }
  },
  data() {
    return {
      //构建方式，way:'Docker-Compose'或'Kubernetes'，
      // methodV:构建value.yaml方式，methodQ:构建question.yaml方式
      build: {
        way: 'Docker-Compose',
        methodV: '默认',
        methodQ: '默认',
      },
      //文件上传 数据结构
      upload: {
        format: 'YAML',
        organization: 'HELM',
        target: 'Deployment',
        file: ''
      },
      //rancher上传信息 数据结构
      rancherUpload: {
        storePath: '',
        fileNameArray: [],
        fileJsonArray: [],
        valueJson: "",
        questionJson: ""
      },
      rancher: {
        default: {
          //构建value.yaml步骤，相关数据
          indeterminateV: [true],
          checkAllV: [false],
          checkAllGroupV: [[]],
          //构建questions.yaml步骤，相关数据
          indeterminateQ: [true],
          checkAllQ: [false],
          checkAllGroupQ: [[]],
        },
        custom: {
          valuesYaml: {
            checkAllGroup: [[]],
            map: new Map(),
            keyArray: [],
            valueArray: []
          },
          questionsYaml: {
            content: ''
          }
        },
        checkAllGroup: [[]],
      },
      //用于控制页面显示信息的 数据结构。
      judge: {
        upload: {target: "",},
        //values、questions文件构建
        selector: {
          valuesYaml: {
            fileNameIndex: 0,
            configItem: '',
            placeholder: 'For example {{ .Value.filename.metadata.name }}',
            keyContent: '',
            valueContent: ''
          },
          questionsYaml: {
            fileNameIndex: 0,
            configItem: '',
            label: '',
            description: '',
            default: ''
          }
        },

      },
      //接收到的数据
      receive: {
        jsonArray: [],
        fileArray: []
      },
      receiveJSONArray: [],
      receiveFileArray: [],
      //复选框数组
      checkArray: [[]],
      objectArray: [],
      objectMap: new Map(),
      uploadPath: '',
      downloadPath: '',
      //目标value.yaml的对象类型
      targetValue: {},
      //目标questions.yaml的对象类型
      targetQuestions: {questions: []},
    }
  },
  methods: {
    isUploadPathEmpty() {
      return this.uploadPath === "";
    },
    isShowDownloadButton() {
      return this.downloadPath !== "";
    },
    isShowCheckGroup(way, methodV) {
      return this.build.way === way && this.build.methodV === methodV;
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
      //对upload对象即上传结构体，进行转换
      let formData = this.transferUpload();
      let config = {headers: {'Content-Type': 'multipart/form-data'}};
      let uploadURL = 'Docker-Compose' === this.build.way ? createRancherByCompose : createRancherByKube;
      //同步更新
      this.judge.upload.target = this.build.way;

      this.$axios.post(uploadURL, formData, config).then((response) => {
        //获取后端返回的数据
        this.uploadPath = response.data.data.targetPath[0];
        this.receiveJSONArray = response.data.data.JSONList;
        this.receiveFileArray = response.data.data.fileList;
        //根据返回码，进行消息显示处理
        let code = response.data.code;
        let message = response.data.message;
        if (code !== 200) {
          commonUtil.error(message);
        } else {
          commonUtil.success(message);
        }
      }).catch((error) => {
        commonUtil.success("信息上传成功！！！");
      });
    },
    //对upload对象进行数据转换
    transferUpload() {
      let formData = new FormData();
      formData.append('format', this.upload.format);
      formData.append('organization', this.upload.organization);
      formData.append('target', this.upload.target);
      formData.append('file', this.upload.file);

      return formData;
    },
    //下载文件包
    download() {
      let pathArray = this.downloadPath.split("/");
      window.location.href = downloadRancher + pathArray[3];
    },
    //添加valuesYamlItem, 功能暂未实现，搁浅！！
    addValuesYamlItem() {
      let fileNameIndex = this.judge.selector.valuesYaml.fileNameIndex;
      let configItem = this.judge.selector.valuesYaml.configItem;
      //构造map，key为选定filename-item，value为映射值
      let key = this.receiveFileArray[fileNameIndex] + "-" + configItem;
      let value = this.judge.selector.valuesYaml.valueContent;
      this.rancher.custom.valuesYaml.map.set(key, value);

      //添加filename-item,进入相应数组
      this.rancher.custom.valuesYaml.keyArray.push(this.judge.selector.valuesYaml.keyContent);
      //添加映射键，进入相应数组
      this.rancher.custom.valuesYaml.valueArray.push(value);
      //添加配置项，进入相应数组
      this.rancher.custom.valuesYaml.checkAllGroup[fileNameIndex].push(configItem);
    },
    //添加questionsYamlItem
    addQuestionsYamlItem() {
      let fileNameIndex = this.judge.selector.questionsYaml.fileNameIndex;
      let fileName = this.receiveFileArray[fileNameIndex];
      let nameWithoutSuffix = fileName.substring(0, fileName.lastIndexOf("."));
      let str = nameWithoutSuffix + "." + this.judge.selector.questionsYaml.configItem;
      let defaultContent = this.judge.selector.questionsYaml.default.trim();
      if (defaultContent !== "") {
        this.targetQuestions.questions.push({
              variable: str,
              default: defaultContent,
              description: this.judge.selector.questionsYaml.description,
              label: this.judge.selector.questionsYaml.label,
            }
        );
      } else {
        this.targetQuestions.questions.push({
              variable: str,
              description: this.judge.selector.questionsYaml.description,
              label: this.judge.selector.questionsYaml.label,
            }
        );
      }
    },
    //check过滤显示
    filterCheck(index, checkItem) {
      let replaceStr = "this.objectArray[" + index + "].";
      return checkItem.replace(replaceStr, "");
    },
    //构造checkArray，即构造value.yaml步骤的复选框信息
    constructCheckArray() {
      //清空checkArray数据
      this.checkArray = [[]];
      //构造objectArray数组
      this.constructObjectArray();
      //遍历objectArray，并将Object解析为String
      for (let index = 0; index < this.objectArray.length; index++) {
        this.parseObjectToString(index, this.objectArray[index]);
      }
    },
    //构造objectArray，
    constructObjectArray() {
      //遍历receiveJSONArray 并将JSON字符串解析为Object，存入objectArray
      for (let index = 0; index < this.receiveJSONArray.length; index++) {
        this.objectArray[index] = JSON.parse(this.receiveJSONArray[index]);
        //如果当前index不为0，同步更新相关数据，即往里面塞最初始的值。
        if (index !== 0) {
          this.checkArray.push([]);
          //rancher 构造
          this.rancher.default.checkAllV.push(false);
          this.rancher.default.indeterminateV.push(true);
          this.rancher.default.checkAllGroupV.push([]);

          this.rancher.custom.valuesYaml.checkAllGroup.push([]);
          this.rancher.checkAllGroup.push([]);
        }
      }
    },
    //对象 -> 字符串
    parseObjectToString(index, object) {
      let keys = Object.keys(object);
      let str = "this.objectArray[" + index + "]";
      this.recursiveParseObject(index, keys, str);
    },
    //递归解析Object
    recursiveParseObject(index, keys, str) {
      //递归终止条件
      if ('object' !== typeof eval(str)) {
        let replaceStr = "this.objectArray[" + index + "].";
        this.checkArray[index].push(str.replace(replaceStr, ""));
        return;
      }

      for (let i = 0; i < keys.length; i++) {
        let newStr, key = keys[i];
        //过滤非法情况。
        if (-1 !== key.indexOf(".")) {
          continue;
        }
        //判断并进行特殊处理
        if (commonUtil.isNumber(key)) {
          //处理 数组的情况。this.objectArray[0].spec.ports[0]
          newStr = str + "[" + key + "]";
        } else {
          newStr = str + "." + key;
        }
        //TODO 此处newStr需要进行改进
        let newKeys = Object.keys(eval(newStr));
        //递归函数调用
        this.recursiveParseObject(index, newKeys, newStr);
      }
    },
    //构建yaml
    constructYaml() {

      //构建相应的JSON数据以及RancherUpload数据结构
      this.constructValueJson();
      this.constructQuestionJson();
      this.constructRancherUpload();

      this.$axios.post(createRancherByGuide, this.rancherUpload).then((response) => {
        this.downloadPath = response.data.data.downloadPath;
      }).catch((error) => {
        commonUtil.error("后台构建rancher出现错误！");
      });

    },
    //构建RancherUpload数据结构
    constructRancherUpload() {
      //遍历objectArray将其转化为JSON并进行存储
      for (let index = 0; index < this.objectArray.length; index++) {
        let fileJson = JSON.stringify(this.objectArray[index]);
        this.rancherUpload.fileJsonArray.push(fileJson)
      }
      this.rancherUpload.storePath = this.uploadPath;
      this.rancherUpload.fileNameArray = this.receiveFileArray;
      this.rancherUpload.valueJson = JSON.stringify(this.targetValue);
      this.rancherUpload.questionJson = JSON.stringify(this.targetQuestions);
    },
    //构建questions.yaml的JSON
    constructQuestionJson() {

      if (this.build.methodQ === "默认") {
        //清空数据
        this.targetQuestions.questions = [];
        let diff = [], checkAllGroupV = [], checkAllGroupQ = [];
        //初始化checkAllGroupV和checkAllGroupQ
        checkAllGroupV = this.rancher.default.checkAllGroupV;
        checkAllGroupQ = this.rancher.default.checkAllGroupQ;

        for (let index = 0; index < this.receiveFileArray.length; index++) {
          //求交集，因为checkAllGroupQ是checkAllGroupV的子集，所以两者必然有交集
          diff[index] = checkAllGroupV[index].filter(function (val) {
            return checkAllGroupQ[index].indexOf(val) !== -1;
          })
        }

        for (let index = 0; index < this.receiveFileArray.length; index++) {
          let fileName = this.receiveFileArray[index];
          let nameWithoutSuffix = fileName.substring(0, fileName.lastIndexOf("."));
          for (let diffIndex = 0; diffIndex < diff[index].length; diffIndex++) {
            let str = nameWithoutSuffix + "." + diff[index][diffIndex];
            this.targetQuestions.questions.push({
              variable: str,
              description: "this is \'" + str + "\' description",
              label: "这是 \'" + str + "\' 的标题信息。",
            });
          }
        }
      } else { //this.build.methodQ === "自定义"
        //以编辑器内容为准，获取编辑器内容并转为对象
        this.targetQuestions = YAML.parse(this.$refs.editor.mirrorCode);
      }
      // console.log(JSON.stringify(this.targetQuestions));

    },
    //构造value.yaml的JSON
    constructValueJson() {
      this.constructObject();
    },
    //构建对象
    constructObject() {
      //提前清空数据
      this.objectMap.clear();

      //判断构建values.yaml时，是默认构建还是自定义。
      let isDefault = this.build.methodV === '默认';
      if (isDefault) {
        for (let index = 0; index < this.rancher.default.checkAllGroupV.length; index++) {
          let array = this.rancher.default.checkAllGroupV[index];
          this.parseArrayToObject(index, array);
        }
      } else {
        commonUtil.error("功能暂未实现！！");
        // let array = this.rancher.custom.valuesYaml.keyArray;
        // this.parseArrayToObject(0, array, "自定义")
      }

      //this.objectMap数据 改造为 object
      for (let index = 0; index < this.receiveFileArray.length; index++) {
        let fileName = this.receiveFileArray[index];
        let word = "objectArray[" + index + "]";
        let mapKey = fileName + "-this-" + word;
        fileName = fileName.substring(0, fileName.lastIndexOf("."));
        if (undefined !== this.objectMap.get(mapKey)) {
          //get(mapKey)数据为 {objectArray[0]:{x}},目标是{x}
          this.targetValue[fileName] = this.objectMap.get(mapKey)[word];
        }
      }
      console.log(JSON.stringify(this.targetValue));
    },
    //数组->对象
    parseArrayToObject(index, array) {
      for (let i = 0; i < array.length; i++) {
        this.parseStrToObject(index, array[i]);
      }
    },
    //字符串->对象
    parseStrToObject(index, str) {
      str = "this.objectArray[" + index + "]." + str;
      let strArray = str.split(".");
      let fileName = this.receiveFileArray[index];
      //重点，倒叙遍历
      for (let i = strArray.length - 1; i > 0; i--) {
        //mapKey特殊设计，目的是让键唯一。文件名+前一个字符+当前字符，
        let mapKey = fileName + "-" + strArray[i - 1] + "-" + strArray[i];
        let value = this.objectMap.get(mapKey);
        let word = strArray[i];
        //判断value，是否已经存在，进行区别处理。
        if (undefined === value) {
          let tempObject = {};
          //判断是否为字符串末尾单词，进行区别处理
          if (i === strArray.length - 1) {

            tempObject[word] = eval(str);
            //同时对 this.objectArray相应的属性进行替换
            let objStr = str.substring(0, str.lastIndexOf("."));
            let property = str.substring(str.lastIndexOf(".") + 1);
            let replaceStr = "this.objectArray[" + index + "].";
            let nameWithoutSuffix = fileName.substring(0, fileName.lastIndexOf("."));
            Object.defineProperty(eval(objStr), property, {
              value: "{{ .Value." + nameWithoutSuffix + "." + str.replace(replaceStr, "") + " }}",
              writable: true,
              configurable: true
            });

          } else {
            let lastMapKey = fileName + "-" + strArray[i] + "-" + strArray[i + 1];
            tempObject[word] = this.objectMap.get(lastMapKey);
          }

          this.objectMap.set(mapKey, tempObject);
        } else {
          let lastMapKey = fileName + "-" + strArray[i] + "-" + strArray[i + 1];
          let tempObject = value[word];
          let lastWord = strArray[i + 1];
          tempObject[lastWord] = this.objectMap.get(lastMapKey)[lastWord];
          value[word] = tempObject;
          this.objectMap.set(mapKey, value); //原先是tempObject
        }
      }

    },
    //相关checkAllGroup改变函数
    rancherDefaultCheckAllGroupVChange(index, data) {
      if (data.length === this.checkArray[index].length) {
        this.rancher.default.indeterminateV.splice(index, 1, false);
        this.rancher.default.checkAllV.splice(index, 1, true);
      } else if (data.length > 0) {
        this.rancher.default.indeterminateV.splice(index, 1, true);
        this.rancher.default.checkAllV.splice(index, 1, false);
      } else {
        this.rancher.default.indeterminateV.splice(index, 1, false);
        this.rancher.default.checkAllV.splice(index, 1, false);
      }
    },
    rancherDefaultCheckAllGroupQChange(index, data) {
      if (data.length === this.rancher.default.checkAllGroupV[index].length) {
        this.rancher.default.indeterminateQ.splice(index, 1, false);
        this.rancher.default.checkAllQ.splice(index, 1, true);
      } else if (data.length > 0) {
        this.rancher.default.indeterminateQ.splice(index, 1, true);
        this.rancher.default.checkAllQ.splice(index, 1, false);
      } else {
        this.rancher.default.indeterminateQ.splice(index, 1, false);
        this.rancher.default.checkAllQ.splice(index, 1, false);
      }
    },
    //全选相关按钮 的方法
    handleRancherDefaultCheckAllV(index) {
      if (this.rancher.default.indeterminateV[index]) {
        this.rancher.default.checkAllV[index] = false;
      } else {
        this.rancher.default.checkAllV[index] = !this.rancher.default.checkAllV[index];
      }

      this.rancher.default.indeterminateV[index] = false;

      if (this.rancher.default.checkAllV[index]) {
        this.rancher.default.checkAllGroupV.splice(index, 1, this.checkArray[index]);
      } else {
        this.rancher.default.checkAllGroupV.splice(index, 1, []);
      }
    },
    handleRancherDefaultCheckAllQ(index) {
      if (this.rancher.default.indeterminateQ[index]) {
        this.rancher.default.checkAllQ[index] = false;
      } else {
        this.rancher.default.checkAllQ[index] = !this.rancher.default.checkAllQ[index];
      }

      this.rancher.default.indeterminateQ[index] = false;

      if (this.rancher.default.checkAllQ[index]) {
        this.rancher.default.checkAllGroupQ.splice(index, 1, this.rancher.checkAllGroup[index]);
      } else {
        this.rancher.default.checkAllGroupQ.splice(index, 1, []);
      }
    },
  }
}
</script>

<style scoped>

</style>