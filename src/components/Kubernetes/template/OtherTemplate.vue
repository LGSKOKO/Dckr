<template>
  <Form :label-width="120" :rules="ruleValidate" onsubmit="return false;">
    <FormItem label="副本数量">
      <Row>
        <Col span="18"><Input v-model="replicas" placeholder="输入副本数量"/></Col>
      </Row>
    </FormItem>
    <FormItem label="匹配标签" prop="matchLabels">
      <Row>
        <Col span="8">
          <Input v-model="temp.matchLabel.key" placeholder="输入相应Pod标签的key"/>
        </Col>
        <Col span="9" offset="1">
          <Input v-model="temp.matchLabel.value" placeholder="输入相应Pod标签的Value" @keyup.enter.native="addLabel"/>
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
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";
export default {
  name: "OtherTemplate",
  data() {
    return {
      temp: {
        matchLabel: {key: '', value: ''},
        matchLabels: []
      },
      replicas:"1",
      matchLabels:{},
      ruleValidate: {
        matchLabels: [{required: true}],
      }
    }
  },
  methods: {
    checkRequiredFields(){
      return commonUtil.isArrayEmpty(this.temp.matchLabels);
    },
    integrateOtherTemplate() {
      return commonUtil.deepClone(this.matchLabels);
    },
    //添加匹配标签
    addLabel() {
      let key = this.temp.matchLabel.key.trim();
      let value = this.temp.matchLabel.value.trim();

      let flag = commonUtil.isStrEmpty(key) || commonUtil.isStrEmpty(value);
      if (flag) {
        this.error("添加标签失败，key/value不能为空");
      } else {
        let str = key + ":" + value;
        this.temp.matchLabels.push(str);
        this.matchLabels[key] = value;
        this.temp.matchLabel.key = "";
        this.temp.matchLabel.value = "";
      }

    },
    removeLabel(event, name) {
      let index = this.temp.matchLabels.indexOf(name);
      this.temp.matchLabels.splice(index, 1);
      //删除metadata的labels
      let key = name.split(":")[0];
      delete this.matchLabels[key];
    },
    //失败消息提示函数
    error: function (title) {
      this.$Notice.error({
        title: title,
      });
    },
  }
}
</script>

<style scoped>

</style>