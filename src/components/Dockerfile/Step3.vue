<template>
  <Form ref="step3" :model="step3" onsubmit="return false;">
    <FormItem
        v-for="(item, index) in step3.items"
        v-if="item.status"
        :key="index"
        :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
      <div v-if="'ADD'===item.key">
        <Row>
          <Col span="2" style="text-align: center">将文件</Col>
          <Col span="8">
            <FormItem>
              <Input type="text" v-model="item.value1" placeholder="Enter key,for example: "></Input>
            </FormItem>
          </Col>
          <Col span="3" style="text-align: center">拷贝至容器的</Col>
          <Col span="8">
            <FormItem>
              <Input type="text" v-model="item.value2" placeholder="Enter value1,for example: "></Input>
            </FormItem>
          </Col>
          <Col span="1" style="text-align: right">目录</Col>
          <Col span="1" offset="1">
            <Button @click="handleRemove(index)">Delete</Button>
          </Col>
        </Row>
      </div>
      <div v-if="'WORKDIR'===item.key">
        <Row>
          <Col span="2" style="text-align: center">将容器</Col>
          <Col span="8" style="text-align: left">
            <FormItem>
              <Input type="text" :readonly=true value="工作目录"></Input>
            </FormItem>
          </Col>
          <Col span="3" style="text-align: center">切换至容器的</Col>
          <Col span="8">
            <FormItem>
              <Input type="text" v-model="item.value1" placeholder="Enter value1,for example: "></Input>
            </FormItem>
          </Col>
          <Col span="1" style="text-align: right">目录</Col>
          <Col span="1" offset="1">
            <Button @click="handleRemove(index)">Delete</Button>
          </Col>
        </Row>
      </div>
      <div v-if="'RUN'===item.key">
        <Row>
          <Col span="2" style="text-align: center">容器执行</Col>
          <Col span="19">
            <FormItem>
              <Input v-model="item.value1" type="textarea" :autosize="{minRows: 4,maxRows: 15}"
                     placeholder="Enter images description..."></Input>
            </FormItem>
          </Col>
          <Col span="1" style="text-align: right">命令</Col>
          <Col span="1" offset="1">
            <Button @click="handleRemove(index)">Delete</Button>
          </Col>
        </Row>
      </div>
    </FormItem>
    <FormItem :label-width="100" label="指令类型" prop="commandType">
      <RadioGroup v-model="step3.commandType" :style="{paddingLeft:'100px'}">
        <Radio label="文件拷贝" border></Radio>
        <Radio label="目录切换" border></Radio>
        <Radio label="命令执行" border></Radio>
      </RadioGroup>
    </FormItem>

    <FormItem>
      <Row>
        <Col span="24">
          <Button type="dashed" long @click="handleAdd" icon="md-add">添加 {{ this.step3.commandType }} 类型命令</Button>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: "Step3",
  data() {
    return {
      step3: {
        commandType: '目录切换',
        items: [],
      },
      index: 0,
    }
  },
  methods: {
    handleAdd() {
      this.index++;
      this.step3.items.push({
        key: this.convertZNToEN(),
        value1: '',
        value2: '',
        index: this.index,
        status: 1
      });
    },
    handleRemove(index) {
      //这里的items[index].status等于1时代表有效，等于0时代表无效
      this.step3.items[index].status = 0;
    },
    convertZNToEN() {
      switch (this.step3.commandType) {
        case "文件拷贝":
          return "ADD";
        case "目录切换":
          return "WORKDIR";
        case "命令执行":
          return "RUN";
      }
    },
  }
}
</script>

<style scoped>

</style>