<template>
  <Form ref="step1" :model="step1" :rules="ruleValidate" :label-width="120" onsubmit="return false;">
    <FormItem label="姓名" prop="maintainer">
      <Row>
        <Col span="19">
          <Input v-model="step1.maintainer" placeholder="输入名字拼音或英文名"></Input>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="邮箱" prop="email">
      <Row>
        <Col span="19">
          <Input v-model="step1.email" placeholder="输入邮箱"></Input>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="日期">
      <Row>
        <Col span="9">
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="step1.date"></DatePicker>
          </FormItem>
        </Col>
        <Col span="1" style="text-align: right">- -</Col>
        <Col span="9" offset="1">
          <FormItem prop="time">
            <TimePicker type="time" placeholder="选择时间" v-model="step1.time"></TimePicker>
          </FormItem>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="描述" prop="description">
      <Row>
        <Col span="19">
          <Input v-model="step1.description" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="输入 Dockerfile 相关描述信息"></Input>
        </Col>
      </Row>
    </FormItem>
    <FormItem
        v-for="(item, index) in step1.items"
        v-if="item.status"
        :key="index"
        :label="'自定义项'"
        :rules="{required: true, message: 'Item can\'t be empty', trigger: 'blur'}">
      <Row>
        <Col span="9">
          <FormItem>
            <Input type="text" v-model="item.key" placeholder="Enter key,for example: "></Input>
          </FormItem>
        </Col>
        <Col span="9" offset="1">
          <FormItem>
            <Input type="text" v-model="item.value" placeholder="Enter value,for example: "></Input>
          </FormItem>
        </Col>
        <Col span="4" offset="1">
          <Button @click="handleRemove(index)">Delete</Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem>
      <Row>
        <Col span="19">
          <Button type="dashed" long @click="handleAdd" icon="md-add">添加自定义项</Button>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: "Step1",
  data () {
    return {
      step1: {
        maintainer: '',
        email: '',
        date: '',
        time: '',
        description: '',
        items: [],
      },
      index: 0,
      //字段校验规则
      ruleValidate: {
        maintainer: [
          { required: true, message: 'The maintainer cannot be empty', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        date: [
          { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
        ],
        time: [
          { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
        ],
        description: [
          { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
          { type: 'string', min: 1, message: 'Introduce no less than 1 words', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleAdd () {
      this.index++;
      this.step1.items.push({
        key: '',
        value: '',
        index: this.index,
        status: 1
      });
    },
    handleRemove (index) {
      // this.step1.items.splice(index,1);
      //这里的items[index].status等于1时代表有效，等于0时代表无效
      this.step1.items[index].status = 0;
    },
  }
}
</script>




<style scoped>

</style>