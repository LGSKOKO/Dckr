<template>
  <Form ref="step2" :model="step2" :rules="ruleValidate" :label-width="120" onsubmit="return false;">
    <FormItem label="基础镜像" prop="basicImage">
      <Row>
        <Col span="19">
          <Input v-model="step2.basicImage" placeholder="输入基础镜像,for example scratch、mysql " />
        </Col>
      </Row>
    </FormItem>
    <FormItem
        v-for="(item, index) in step2.items"
        v-if="item.status"
        :key="index"
        :label="'环境变量 '"
        >
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
          <Button type="dashed" long @click="handleAdd" icon="md-add">添加环境变量项</Button>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: "Step2",
  data() {
    return {
      step2: {
        basicImage: '',
        items: [],
      },
      index: 0,
      ruleValidate: {
        basicImage: [
          {required: true, message: 'The basicImage cannot be empty', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    handleAdd() {
      this.index++;
      this.step2.items.push({
        key: '',
        value: '',
        index: this.index,
        status: 1
      });
    },
    handleRemove(index) {
      //这里的items[index].status等于1时代表有效，等于0时代表无效
      this.step2.items[index].status = 0;
    },

  }
}
</script>

<style scoped>

</style>