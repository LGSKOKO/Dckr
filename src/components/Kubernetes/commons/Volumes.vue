<template>
  <Form :label-width="120" onsubmit="return false;">
    <FormItem label="emptyDir">
      <Row>
        <Col span="17" class="paddingRightUnit"><Input v-model="emptyDirVolume.name" placeholder="输入数据卷名" @keyup.enter.native="addVolume('emptyDir')"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addVolume('emptyDir')">添加数据卷</Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="hostPath">
      <Row>
        <Col span="8"><Input v-model="hostPathVolume.name" placeholder="输入数据卷名"/></Col>
        <Col sapn="9" offset="1"><Input v-model="hostPathVolume.hostPath.path" placeholder="输入主机的绝对路径" @keyup.enter.native="addVolume('hostPath')"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addVolume('hostPath')">添加数据卷</Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="configMap">
      <Row>
        <Col span="8"><Input v-model="configMapVolume.name" placeholder="输入数据卷名"/></Col>
        <Col sapn="9" offset="1"><Input v-model="configMapVolume.configMap.name" placeholder="输入ConfigMap的名字" @keyup.enter.native="addVolume('configMap')"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addVolume('configMap')">添加数据卷</Button>
        </Col>
      </Row>
      <Row>
        <Col span="8"><Input v-model="configMapItem.key" placeholder="输入configMapRefKey"/></Col>
        <Col sapn="9" offset="1"><Input v-model="configMapItem.path" placeholder="输入Path" @keyup.enter.native="addConfigMapItem"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addConfigMapItem">添加 Item</Button>
        </Col>
      </Row>
      <Tag v-for="item in configMapItems" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removeConfigMapItem">
        {{ item }}
      </Tag>
    </FormItem>
    <FormItem label="secret">
      <Row>
        <Col span="8"><Input v-model="secretVolume.name" placeholder="输入数据卷名"/></Col>
        <Col sapn="9" offset="1"><Input v-model="secretVolume.secret.name" placeholder="输入Secret的名字" @keyup.enter.native="addVolume('secret')"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addVolume('secret')">添加数据卷</Button>
        </Col>
      </Row>
      <Row>
        <Col span="8"><Input v-model="secretItem.key" placeholder="输入secretRefKey"/></Col>
        <Col sapn="9" offset="1"><Input v-model="secretItem.path" placeholder="输入Path" @keyup.enter.native="addSecretItem"/></Col>
        <Col span="2" offset="1">
          <Button icon="ios-add" type="dashed" size="small" @click="addSecretItem">添加 Item</Button>
        </Col>
      </Row>
      <Tag v-for="item in secretItems" :key="item" :name="item" type="border" color="primary" closable
           @on-close="removeSecretItem">
        {{ item }}
      </Tag>
    </FormItem>
    <div style="padding-left: 120px">
      <div v-show="!isArrayEmpty(this.emptyDirsTip)">
        emptyDir:
        <Tag v-for="item in emptyDirsTip" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeEmptyDirVolume">
          {{ item }}
        </Tag>
      </div>
      <div v-show="!isArrayEmpty(this.hostPathsTip)">
        hostPath:
        <Tag v-for="item in hostPathsTip" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeHostPathVolume">
          {{ item }}
        </Tag>
      </div>
      <div v-show="!isArrayEmpty(this.configMapsTip)">
        configMap:
        <Tag v-for="item in configMapsTip" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeConfigMapVolume">
          {{ item }}
        </Tag>
      </div>
      <div v-show="!isArrayEmpty(this.secretsTip)">
        secret:
        <Tag v-for="item in secretsTip" :key="item" :name="item" type="border" color="primary" closable
             @on-close="removeSecretVolume">
          {{ item }}
        </Tag>
      </div>
    </div>
  </Form>
</template>

<script>
import commonUtil from "@/commonUtil";

export default {
  name: "Volumes",
  props: {
    resourceType: String,
    resourceName: String
  },
  data() {
    return {
      secretItem: {key: "", path: ""},
      configMapItem: {key: "", path: ""},
      emptyDirVolume: {name: "", emptyDir: "{}"},
      hostPathVolume: {name: "", hostPath: {path: ""}},
      configMapVolume: {name: "", configMap: {name: "", items: []}},
      secretVolume: {name: "", secret: {name: "", items: []}},
      emptyDirs: [], hostPaths: [], secrets: [], configMaps: [], secretItems: [], configMapItems: [], volumes: [],
      emptyDirsTip: [], hostPathsTip: [], secretsTip: [], configMapsTip: []
    }
  },
  methods: {
    integrateVolumes() {
      this.pushAllArrayToVolumes();
      return commonUtil.deepClone(this.volumes);
    },
    pushAllArrayToVolumes() {
      //使用前先清空
      this.volumes = [];
      this.pushArrayToVolumes(this.emptyDirs);
      this.pushArrayToVolumes(this.hostPaths);
      this.pushArrayToVolumes(this.configMaps);
      this.pushArrayToVolumes(this.secrets);
    },
    pushArrayToVolumes(arr) {
      for (let index = 0; index < arr.length; index++) {
        this.volumes.push(arr[index]);
      }
    },
    //添加持久卷
    addVolume(type) {
      switch (type) {
        case "emptyDir":
          this.addEmptyDirVolume();
          break;
        case "hostPath":
          this.addHostPathVolume();
          break;
        case "secret":
          this.addSecretVolume();
          break;
        case "configMap":
          this.addConfigMapVolume();
          break;
      }
    },
    //数据卷相关添加方法
    addEmptyDirVolume() {
      this.emptyDirs.push(this.emptyDirVolume);
      let str = this.emptyDirVolume.name;
      this.emptyDirsTip.push(str);

      //store.pod的volume进行相应数据添加
      this.addStoreVolume('emptyDir', str);
    },
    addHostPathVolume() {
      this.hostPaths.push(this.hostPathVolume);
      let str = this.hostPathVolume.name;
      this.hostPathsTip.push(str);

      //store.pod的volume进行相应数据添加
      this.addStoreVolume('hostPath', str);
    },
    addSecretVolume() {
      //进行判断items是否为空，空则删除该属性
      if (commonUtil.isArrayEmpty(this.secretVolume.secret.items)) {
        delete this.secretVolume.secret.items;
      }
      this.secrets.push(commonUtil.deepClone(this.secretVolume));
      //item数组清空
      this.secretVolume.secret["items"] = [];
      this.configMapItems = [];
      let str = this.secretVolume.name;
      this.secretsTip.push(str);

      //store.pod的volume进行相应数据添加
      this.addStoreVolume('secret', str);
    },
    addConfigMapVolume() {
      //进行判断items是否为空，空则删除该属性
      if (commonUtil.isArrayEmpty(this.configMapVolume.configMap.items)) {
        delete this.configMapVolume.configMap.items;
      }
      this.configMaps.push(commonUtil.deepClone(this.configMapVolume));
      //item数组清空
      this.configMapVolume.configMap["items"] = [];
      this.configMapItems = [];
      let str = this.configMapVolume.name;
      this.configMapsTip.push(str);

      //store.pod的volume进行相应数据添加
      this.addStoreVolume('configMap', str);
    },
    addStoreVolume(volumeType, volumeName) {
      let structure = {resourceName: this.resourceName, volumeType: volumeType, volumeName: volumeName}
      switch (this.resourceType) {
        case 'pod':
          this.$store.commit('addPodVolume', structure);
          break;
        case 'replicaSet':
          this.$store.commit('addReplicaSetVolume', structure);
          break;
        case 'deployment':
          this.$store.commit('addDeploymentVolume', structure);
          break;
      }
    },
    //数据卷相关删除方法
    removeEmptyDirVolume(event, name) {
      let index = this.emptyDirsTip.indexOf(name);
      this.emptyDirsTip.splice(index, 1);
      this.emptyDirs.splice(index, 1);

      this.removeStoreVolume('emptyDir',name);
    },
    removeHostPathVolume(event, name) {
      let index = this.hostPathsTip.indexOf(name);
      this.hostPathsTip.splice(index, 1);
      this.hostPaths.splice(index, 1);

      this.removeStoreVolume('hostPath',name);
    },
    removeSecretVolume(event, name) {
      let index = this.secretsTip.indexOf(name);
      this.secretsTip.splice(index, 1);
      this.secrets.splice(index, 1);

      this.removeStoreVolume('secret',name);
    },
    removeConfigMapVolume(event, name) {
      let index = this.configMapsTip.indexOf(name);
      this.configMapsTip.splice(index, 1);
      this.configMaps.splice(index, 1);

      this.removeStoreVolume('configMap',name);
    },
    removeStoreVolume(volumeType, volumeName) {
      let structure = {resourceName: this.resourceName, volumeType: volumeType, volumeName: volumeName}
      switch (this.resourceType) {
        case 'pod':
          this.$store.commit('removePodVolume', structure);
          break;
        case 'replicaSet':
          this.$store.commit('removeReplicaSetVolume', structure);
          break;
        case 'deployment':
          this.$store.commit('removeDeploymentVolume', structure);
          break;
      }
    },
    //SecretItem增加、删除方法
    addSecretItem() {
      this.secretItems.push(this.secretItem.key);
      this.secretVolume.secret.items.push(commonUtil.deepClone(this.secretItem));
    },
    removeSecretItem(event, name) {
      let index = this.secretItems.indexOf(name);
      this.secretItems.splice(index, 1);
      this.secretVolume.secret.items.splice(index, 1);
    },
    //configMapItem增加、删除方法
    addConfigMapItem() {
      this.configMapItems.push(this.configMapItem.key);
      this.configMapVolume.configMap.items.push(commonUtil.deepClone(this.configMapItem));
    },
    removeConfigMapItem(event, name) {
      let index = this.configMapItems.indexOf(name);
      this.configMapItems.splice(index, 1);
      this.configMapVolume.configMap.items.splice(index, 1);
    },
    isArrayEmpty(arr) {
      return arr.length <= 0;
    }
  }
}
</script>

<style scoped>
.paddingRightUnit {
  padding-right: 10px;
}
</style>