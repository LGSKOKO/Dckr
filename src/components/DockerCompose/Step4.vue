<template>
  <Form ref="step4" :model="step4"  :label-width="120" onsubmit="return false;">
    <FormItem label="副本数目">
      <Input v-model="step4.deploy.replicas" placeholder="Enter quantity of replica "/>
    </FormItem>
    <FormItem label="资源限制">
      <Row>
        <Col span="2" class="col-padding-right">
          CPU
        </Col>
        <Col span="9" class="col-padding-right">
          <Input v-model="step4.deploy.resources.limits.cpus" placeholder="Enter 0-1,for example 0.5"/>
        </Col>
        <Col span="2">
          内存
        </Col>
        <Col span="10" class="col-padding-right">
          <Input v-model="step4.deploy.resources.limits.memory" placeholder="Enter memory,for example 50M"/>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="重启配置">
      <Row>
        <Col span="4" class="col-margin-right">
          重启条件
        </Col>
        <Col span="18">
          <Select v-model="step4.deploy.restart_policy.condition">
            <Option v-for="item in temp.deploy.restart_policy.condition" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="row-margin-top">
        <Col span="4" class="col-margin-right">
          重启间隔时间
        </Col>
        <Col span="18">
          <Input v-model="step4.deploy.restart_policy.delay" placeholder="Enter delay time,for example 5s"/>
        </Col>
      </Row>
      <Row class="row-margin-top">
        <Col span="4" class="col-margin-right">
          持续时间
        </Col>
        <Col span="18">
          <Input v-model="step4.deploy.restart_policy.window" placeholder="Enter memory,for example 50M"/>
        </Col>
      </Row>
      <Row class="row-margin-top">
        <Col span="4" class="col-margin-right">
          最大重启次数
        </Col>
        <Col span="18">
          <Input v-model="step4.deploy.restart_policy.max_attempts" placeholder="Enter the max_attempts"/>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="更新配置">
      <Row>
        <Col span="4" class="col-margin-right">
          更新策略
        </Col>
        <Col span="18">
          <Select v-model="step4.deploy.update_config.order">
            <Option v-for="item in temp.deploy.update_config.order" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="row-margin-top">
        <Col span="4" class="col-margin-right">
          更新间隔时间
        </Col>
        <Col span="18">
          <Input v-model="step4.deploy.update_config.delay" placeholder="Enter delay time,for example 5s"/>
        </Col>
      </Row>
      <Row class="row-margin-top">
        <Col span="4" class="col-margin-right">
          一次更新数量
        </Col>
        <Col span="18">
          <Input v-model="step4.deploy.update_config.parallelism" placeholder="Enter the quantity of one-time update"/>
        </Col>
      </Row>
      <Row class="row-margin-top">
        <Col span="4" class="col-margin-right">
          更新失败操作
        </Col>
        <Col span="18">
          <Select v-model="step4.deploy.update_config.failure_action">
            <Option v-for="item in temp.deploy.update_config.failure_action" :value="item" :key="item">
              {{ item }}
            </Option>
          </Select>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: "Step4",
  data() {
    return {
      temp: {
        deploy: {
          restart_policy: {condition: ['always','any', 'on-failure', 'none']},
          update_config: {
            order: ['stop-first', 'start-first'],
            failure_action: ['continue', 'rollback', 'pause']
          }
        },
      },
      step4: {
        deploy: {
          replicas: '', labels: {}, placement: {},
          resources: {limits: {cpus: '', memory: ''}},
          update_config: {parallelism: '', delay: '', failure_action: '', order: ''},
          restart_policy: {condition: '', delay: '', max_attempts: '', window: ''},
        },
      },
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.row-margin-top {
  margin-top: 5px;
}

.col-margin-right {
  text-align: right;
  margin-right: 10px;
}

.col-padding-right {
  text-align: right;
  padding-right: 10px;
}
</style>