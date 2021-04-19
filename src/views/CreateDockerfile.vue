<template>
  <div>
    <div>
      <Steps :current="current" style="cursor:pointer;">
        <Step :title="showStepTip(0)" content="填写镜像元数据" @click.native="jumpToStep(0)"></Step>
        <Step :title="showStepTip(1)" content="填写镜像全局配置" @click.native="jumpToStep(1)"></Step>
        <Step :title="showStepTip(2)" content="填写镜像主要信息" @click.native="jumpToStep(2)"></Step>
        <Step :title="showStepTip(3)" content="填写镜像其他信息" @click.native="jumpToStep(3)"></Step>
        <Step :title="showStepTip(4)" content="构建Dockerfile" @click.native="jumpToStep(4)"></Step>
      </Steps>
      <br/>
      <Button type="primary" @click="next">下一步</Button>
      <Button type="primary" @click="createDockerfile" v-show="this.current===4" style="float: right">
        构 建
      </Button>
    </div>
    <Step1 v-show="isCurrentStep(0)" ref="step1"
           :style="{width: '700px',margin: '0 auto' }"></Step1>
    <Step2 v-show="isCurrentStep(1)" ref="step2"
           :style="{width: '700px',margin: '0 auto' }"></Step2>
    <Step3 v-show="isCurrentStep(2)" ref="step3"
           :style="{width: '700px',margin: '0 auto' }"></Step3>
    <Step4 v-show="isCurrentStep(3)" ref="step4"
           :style="{width: '700px',margin: '0 auto' }"></Step4>
    <Step5 v-show="isCurrentStep(4)" ref="step5"
           :style="{width: '800px',margin: '0 auto' }"
           :DockerfileContent="DockerfileContent"></Step5>

  </div>
</template>

<script>
import HeaderNav from '../components/Header.vue';
import SiderNav from '../components/Sider.vue';
import Step1 from "@/components/Dockerfile/Step1";
import Step2 from "@/components/Dockerfile/Step2";
import Step3 from "@/components/Dockerfile/Step3";
import Step4 from "@/components/Dockerfile/Step4";
import Step5 from "@/components/Dockerfile/Step5";
import commonUtil from "@/commonUtil";

let newline = " \\ \n ";
let wrap = "\"";
let equal = "=";
let space = " ";

export default {
  name: "CreateDockerfile",
  components: {
    HeaderNav, SiderNav,
    Step1, Step2, Step3, Step4, Step5,
  },
  data() {
    return {
      current: 0,
      step1: {}, step2: {}, step3: {}, step4: {}, step5: {},
      DockerfileContent: "",
    }
  },
  methods: {
    next() {
      if (this.current === 4) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    //步骤条提示信息
    showStepTip(current) {
      if (current > this.current) {
        return "未进行";
      } else if (current === this.current) {
        return "进行中";
      } else {
        return "已完成";
      }
    },
    jumpToStep(current) {
      this.current = current;
    },
    isCurrentStep(current) {
      return this.current === current;
    },
    createDockerfile() {
      //置空
      this.DockerfileContent = "";

      //获取子组件的值
      this.getChildrenValue();

      //检查必填项是否填写
      if (this.checkRequiredFields()){
       // 构建dockerfile
          let temp = "FROM" + space + this.step2.basicImage + "\n";
          this.DockerfileContent += temp;
          this.DockerfileContent += this.integrateStep1();
          this.DockerfileContent += "\n \n";
          this.DockerfileContent += this.integrateStep2();
          this.DockerfileContent += this.integrateStep3();
          this.DockerfileContent += "\n";
          this.DockerfileContent += this.integrateStep4();
      }

    },
    //获取子组件的值
    getChildrenValue() {
      this.step1 = this.$refs.step1.step1;
      this.step2 = this.$refs.step2.step2;
      this.step3 = this.$refs.step3.step3;
      this.step4 = this.$refs.step4.step4;
    },
    //检查必填项
    checkRequiredFields() {
      if (commonUtil.isStrEmpty(this.step1.maintainer) || commonUtil.isStrEmpty(this.step2.basicImage)) {
        this.$Message.error("有尚未填写的必填项！");
        return false;
      }
      return true;
    },
    integrateStep1() {
      let str = "LABEL" + space + "maintainer" + equal + wrap + this.step1.maintainer + wrap;

      str += this.integrateStep1Item("email", this.step1.email);
      str += this.integrateStep1Item("date", this.step1.date);
      str += this.integrateStep1Item("time", this.step1.time);
      str += this.integrateStep1Item("description", this.step1.description);

      //循环遍历自定义项，并进行添加
      for (let i = 0; i < this.step1.items.length; i++) {
        if (this.step1.items[i].status === 1) {
          str += this.integrateStep1Item(this.step2.items[i].key, this.step2.items[i].value);
        }
      }

      return str;
    },
    integrateStep2() {
      let str = "";
      for (let i = 0; i < this.step2.items.length; i++) {
        if (this.step2.items[i].status === 1) {
          str += this.integrateStep2Item(this.step2.items[i].key, this.step2.items[i].value);
        }
      }
      return str;
    },
    integrateStep3() {
      let str = "";
      for (let i = 0; i < this.step3.items.length; i++) {
        if (this.step3.items[i].status === 1) {
          str += this.integrateStep3Item(this.step3.items[i].key, this.step3.items[i].value1, this.step3.items[i].value2);
        }
      }
      return str;
    },
    integrateStep4() {
      let str = "";
      //添加开发端口信息
      str += this.integrateStep4Item("expose", this.step4.exposes);
      //添加持久存储信息
      str += this.integrateStep4Item("volume", this.step4.volumes);
      //添加启动命令信息
      if (!commonUtil.isStrEmpty(this.step4.entryPoint)) {
        str += "ENTRYPOINT" + space + this.step4.entryPoint + " \n";
      }
      return str;
    },
    integrateStep1Item(key, value) {

      if (commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value)) {
        return "";
      }
      return newline + space + key + equal + wrap + value + wrap;
    },
    integrateStep2Item(key, value) {
      if (commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value)) {
        return "";
      }
      //判断字符串是否含有空格，进行特殊处理，有空格则将字符包围。
      if (value.trim().indexOf(" ") !== -1) {//有空格
        return "ENV" + space + key + equal + wrap + value + wrap + "\n";
      } else {
        return "ENV" + space + key + equal + value + "\n";
      }

    },
    integrateStep3Item(key, value1, value2) {
      //key或value为空，不符合。
      if (commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value1)) {
        return "";
      }
      //ADD，需要value1、value2有效，
      if ("ADD" === key && commonUtil.isStrEmpty(value2)) {
        return "";
      }
      return key + space + value1 + space + value2 + " \n \n";
    },
    integrateStep4Item(key, value) {
      //这里的value是数组
      if (commonUtil.isStrEmpty(key) || commonUtil.isArrayEmpty(value)) {
        return "";
      }
      let str = key + space;
      for (let index = 0; index < value.length; index++) {
        str += value[index] + space
      }
      return str + " \n";
    },

  }
}
</script>

<style scoped>

</style>